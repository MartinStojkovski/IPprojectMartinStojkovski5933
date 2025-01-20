import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
})
export class InputFormComponent {
  invoice = {
    id: '',
    issuer: '',
    recipient: '',
  };

  rows = [{ product: '', quantity: 0, price: 0, totalPrice: 0 }];
  logoBase64: string | null = null;
  taxDisplayOption: 'item' | 'bottom' = 'bottom';
  taxPercentage: number = 0;
  logoUploaded: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;


  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {
    this.refreshPDF();
  }

  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoBase64 = reader.result as string;
        this.logoUploaded = true; 
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  calculateTax(total: number): number {
    return (total * this.taxPercentage) / 100;
  }

  calculateTotalTax(): number {
    return this.rows.reduce((sum, row) => sum + this.calculateTax(row.totalPrice), 0);
  }

  updateTotalPrice(row: any) {
    row.totalPrice = row.quantity * row.price;
  }

  calculateSubtotal(): number {
    return this.rows.reduce((sum, row) => sum + row.totalPrice, 0);
  }

  addRow() {
    this.rows.push({ product: '', quantity: 0, price: 0, totalPrice: 0 });
    this.refreshPDF();
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.refreshPDF();
  }
  async generatePDF(): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    let yPosition = 750;
  
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    if (this.logoBase64) {
      const logoBytes = await fetch(this.logoBase64).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, { x: 500, y: 700, width: 100, height: 100 });
    }
  
    page.drawText('INVOICE', { x: 250, y: yPosition, size: 24, font: boldFont });
    yPosition -= 100;
  
    page.drawText(`Invoice ID: ${this.invoice.id}`, { x: 50, y: yPosition, size: 12, font });
    page.drawText(`Date: ${formattedDate}`, { x: 400, y: yPosition, size: 12, font });
    yPosition -= 20;
    page.drawText(`Issuer: ${this.invoice.issuer}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
    page.drawText(`Recipient: ${this.invoice.recipient}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 50;
  
    page.drawText('Product', { x: 50, y: yPosition, size: 12, font: boldFont });
    page.drawText('Quantity', { x: 200, y: yPosition, size: 12, font: boldFont });
    page.drawText('Price', { x: 300, y: yPosition, size: 12, font: boldFont });
    page.drawText('Total', { x: 400, y: yPosition, size: 12, font: boldFont });
    if (this.taxDisplayOption === 'item') {
      page.drawText('Tax', { x: 500, y: yPosition, size: 12, font: boldFont });
    }
    yPosition -= 20;
  
    this.rows.forEach((row) => {
      page.drawText(row.product, { x: 50, y: yPosition, size: 12, font });
      page.drawText(row.quantity.toString(), { x: 200, y: yPosition, size: 12, font });
      page.drawText(`${row.price.toFixed(2)}$`, { x: 300, y: yPosition, size: 12, font });
      page.drawText(`${row.totalPrice.toFixed(2)}$`, { x: 400, y: yPosition, size: 12, font });
      if (this.taxDisplayOption === 'item') {
        page.drawText(`${this.calculateTax(row.totalPrice).toFixed(2)}$ (${this.taxPercentage}%)`, { x: 500, y: yPosition, size: 12, font });
      }
      yPosition -= 20;
    });
  
    const subtotal = this.calculateSubtotal();
    const totalTax = this.calculateTotalTax();
    const total = subtotal + totalTax;
  
    yPosition -= 30;
    page.drawText(`Subtotal: ${subtotal.toFixed(2)}$`, { x: 50, y: yPosition, size: 12, font: boldFont });
    if (this.taxDisplayOption === 'bottom') {
      yPosition -= 20;
      page.drawText(`Total Tax: ${totalTax.toFixed(2)}$ (${this.taxPercentage}%)`, { x: 50, y: yPosition, size: 12, font: boldFont });
    }
  
    yPosition -= 20;
    page.drawText(`Total: ${total.toFixed(2)}$`, { x: 50, y: yPosition, size: 12, font: boldFont });

    
yPosition -= 100;


page.drawLine({
  start: { x: 50, y: yPosition },
  end: { x: 250, y: yPosition },
  thickness: 1,
});
page.drawText('Issuer', { x: 130, y: yPosition - 15, size: 12, font });


page.drawLine({
  start: { x: 350, y: yPosition },
  end: { x: 550, y: yPosition },
  thickness: 1,
});
page.drawText('Recipient', { x: 430, y: yPosition - 15, size: 12, font });

  
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  async refreshPDF() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl as string);
    }

    const blob = await this.generatePDF();
    const url = URL.createObjectURL(blob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async downloadPDF() {
    const blob = await this.generatePDF();
    const url = URL.createObjectURL(blob);
    await this.sendPDFToBackend(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  async sendPDFToBackend(blob: Blob) {
    const formData = new FormData();
    formData.append(
      'pdf',
      blob,
      `invoice-${this.invoice.id || Date.now()}.pdf`,
    );

    this.http.post('http://localhost:3000/upload-pdf', formData).subscribe({
      next: (response: any) => {
        console.log('PDF successfully sent to the backend:', response);
        alert('PDF uploaded successfully!');
      },
      error: (error: any) => {
        console.error('Error uploading PDF:', error);
        alert('Failed to upload PDF.');
      },
    });
  }
}
