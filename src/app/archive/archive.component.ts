import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  selector: 'app-archive',
  template: `
    <div class="archive-container">
      <h1>Archive</h1>
      <ul>
        <li *ngFor="let file of files" class="file-item">
          <a [href]="file.url" target="_blank">
            <img src="pdf_icon/pdf-file.png" alt="PDF Icon" class="pdf-icon" />
          </a>
          <span class="file-name">{{ file.name }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .archive-container {
      padding: 1em;
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }

    .file-item {
      margin: 1em;
      text-align: center;
      width: 100px;
    }

    .pdf-icon {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }

    .file-name {
      display: block;
      margin-top: 0.5em;
      font-size: 0.9em;
      word-wrap: break-word;
    }
  `]
})
export class ArchiveComponent implements OnInit {
  files: { name: string, url: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    const backendUrl = 'http://localhost:3000'; // Base URL of the backend
    const listFilesEndpoint = `${backendUrl}/list-files`; // Endpoint to fetch file names
    const uploadsUrl = `${backendUrl}/uploads`; // Base URL to access files
  
    this.http.get<string[]>(listFilesEndpoint).subscribe({
      next: (fileNames) => {
        this.files = fileNames.map(name => ({
          name,
          url: `${uploadsUrl}/${name}` // Construct the full file URL
        }));
      },
      error: (err) => {
        console.error('Error fetching files:', err);
      }
    });
  }
}
