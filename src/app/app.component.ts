import { Component } from '@angular/core';
import { FileSystemService } from './services/file-system.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { GalleryComponent } from './components/gallery/gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, GalleryComponent],
  template: `
    <mat-toolbar color="primary">
      <span>Gallery Viewer</span>
      <span class="spacer"></span>
      <button mat-raised-button (click)="pickFolders()">📂 Choisir des dossiers</button>
    </mat-toolbar>

    <app-gallery *ngIf="files.length > 0" [files]="files"></app-gallery>
    <div *ngIf="files.length === 0" class="empty">Sélectionne un ou plusieurs dossiers pour afficher la galerie</div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .empty { display: flex; justify-content: center; align-items: center; height: 80vh; font-size: 1.2rem; color: gray; }
  `]
})
export class AppComponent {
  files: File[] = [];

  constructor(private fs: FileSystemService) {}

  async pickFolders() {
    const newFiles = await this.fs.pickFolders();
    this.files = [...this.files, ...newFiles];
  }
}
