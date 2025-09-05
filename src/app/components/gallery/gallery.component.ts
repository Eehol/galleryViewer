import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUrlPipe } from '../../pipes/file-url.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FileUrlPipe, MatButtonModule],
  template: `
    <button mat-button (click)="toggleAutoScroll()">
      {{ autoScroll ? 'Stop scroll' : 'Auto-scroll' }}
    </button>

    <div class="gallery">
      <div *ngFor="let file of files; let i = index" class="item" (click)="toggleFullscreen(i)">
        <img *ngIf="file.type.startsWith('image')" [src]="file | fileUrl" />
        <video *ngIf="file.type.startsWith('video')" [src]="file | fileUrl" controls></video>
      </div>
    </div>

    <!-- Fullscreen overlay -->
    <div *ngIf="fullscreenIndex !== null" class="fullscreen-overlay" (click)="toggleFullscreen(null)">
      <img *ngIf="currentFile.type.startsWith('image')" [src]="currentFile | fileUrl" />
      <video *ngIf="currentFile.type.startsWith('video')" [src]="currentFile | fileUrl" controls autoplay></video>
    </div>
  `,
  styles: [`
    .gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      overflow-y: auto;
      max-height: 90vh;
      padding: 10px;
    }
    .item {
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .item img, .item video {
      width: auto;
      height: auto;
      max-height: 300px;
      border-radius: 8px;
      transition: transform 0.3s ease;
    }
    .fullscreen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      cursor: pointer;
    }
    .fullscreen-overlay img, .fullscreen-overlay video {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `]
})
export class GalleryComponent {
  @Input() files: File[] = [];

  autoScroll = false;
  interval: any;
  fullscreenIndex: number | null = null;

  get currentFile(): File {
    return this.fullscreenIndex !== null ? this.files[this.fullscreenIndex] : this.files[0];
  }

  toggleAutoScroll() {
    this.autoScroll = !this.autoScroll;
    if (this.autoScroll) {
      this.interval = setInterval(() => {
        window.scrollBy({ top: 2, behavior: 'smooth' });
      }, 50);
    } else {
      clearInterval(this.interval);
    }
  }

  toggleFullscreen(index: number | null) {
    this.fullscreenIndex = index;
  }

  // Navigation clavier
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.fullscreenIndex === null) return;

    if (event.key === 'ArrowRight') {
      this.nextFile();
    } else if (event.key === 'ArrowLeft') {
      this.prevFile();
    }
  }

  // Navigation molette
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.fullscreenIndex === null) return;

    if (event.deltaY > 0) {
      this.nextFile();
    } else if (event.deltaY < 0) {
      this.prevFile();
    }
  }

  private nextFile() {
    if (this.fullscreenIndex === null) return;
    this.fullscreenIndex = (this.fullscreenIndex + 1) % this.files.length;
  }

  private prevFile() {
    if (this.fullscreenIndex === null) return;
    this.fullscreenIndex = (this.fullscreenIndex - 1 + this.files.length) % this.files.length;
  }
}
