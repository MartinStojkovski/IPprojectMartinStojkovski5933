import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFDocument } from 'pdf-lib';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent {
  invoice = {
    id: '',
    issuer: '',
    recipient: ''
  };

  rows = [{ product: '', quantity: 0, price: 0, totalPrice: 0 }];

  pdfUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.refreshPDF(); // Generate the initial PDF preview
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

    // Header Information
    page.drawText(`Invoice ID: ${this.invoice.id }`, { x: 50, y: yPosition, size: 20 });
    yPosition -= 30;
    page.drawText(`Issuer: ${this.invoice.issuer }`, { x: 50, y: yPosition, size: 20 });
    yPosition -= 30;
    page.drawText(`Recipient: ${this.invoice.recipient }`, { x: 50, y: yPosition, size: 20 });
    yPosition -= 30;
    page.drawText(`Date: ${formattedDate}`, { x: 50, y: yPosition, size: 20 });

    // Table Headers
    yPosition -= 60;
    page.drawText('Product', { x: 50, y: yPosition, size: 16 });
    page.drawText('Quantity', { x: 200, y: yPosition, size: 16 });
    page.drawText('Price', { x: 300, y: yPosition, size: 16 });
    page.drawText('Total', { x: 400, y: yPosition, size: 16 });

    
    let subtotal = 0;
    this.rows.forEach((row) => {
      yPosition -= 20;
      page.drawText(row.product , { x: 50, y: yPosition, size: 12 });
      page.drawText(row.quantity.toString() || '0', { x: 200, y: yPosition, size: 12 });
      page.drawText(row.price.toFixed(2) || '0.00', { x: 300, y: yPosition, size: 12 });
      page.drawText(row.totalPrice.toFixed(2) || '0.00', { x: 400, y: yPosition, size: 12 });
      subtotal += row.totalPrice;
    });

    
    yPosition -= 40;
    page.drawText('Subtotal:', { x: 300, y: yPosition, size: 16 });
    page.drawText(subtotal.toFixed(2), { x: 400, y: yPosition, size: 16 });

    
    yPosition -= 200;
    page.drawLine({ start: { x: 50, y: yPosition }, end: { x: 250, y: yPosition }, thickness: 1 });
    page.drawLine({ start: { x: 300, y: yPosition }, end: { x: 500, y: yPosition }, thickness: 1 });

    yPosition -= 20;
    page.drawText('Issuer', { x: 120, y: yPosition, size: 14 });
    page.drawText('Recipient', { x: 370, y: yPosition, size: 14 });

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

    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }
}
