import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUrlPipe } from '../../pipes/file-url.pipe';
import { MatButtonModule } from '@angular/material/button';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FileUrlPipe, MatButtonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @Input() files: File[] = [];

  autoScroll = false;
  interval: any;
  fullscreenIndex: number | null = null;

  favorites: Set<string> = new Set();

  constructor(private favService: FavoriteService) { }

  ngOnInit() {
    const saved = this.favService.load();
    this.favorites = new Set(saved);
  }

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

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.fullscreenIndex === null) return;

    if (event.key === 'ArrowRight') this.nextFile();
    else if (event.key === 'ArrowLeft') this.prevFile();
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.fullscreenIndex === null) return;

    if (event.deltaY > 0) this.nextFile();
    else if (event.deltaY < 0) this.prevFile();
  }

  private nextFile() {
    if (this.fullscreenIndex === null) return;
    this.fullscreenIndex = (this.fullscreenIndex + 1) % this.files.length;
  } 
  showOnlyFavorites = false; // nouveau toggle

  get displayedFiles(): File[] {
    if (this.showOnlyFavorites) {
      return this.files.filter(f => this.isFavorite(f));
    }
    return this.files;
  }

  toggleShowFavorites() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
  }


  private prevFile() {
    if (this.fullscreenIndex === null) return;
    this.fullscreenIndex = (this.fullscreenIndex - 1 + this.files.length) % this.files.length;
  }

  toggleFavorite(file: File) {
    const key = file.name + '_' + file.lastModified;
    if (this.favorites.has(key)) this.favorites.delete(key);
    else this.favorites.add(key);

    this.favService.save(Array.from(this.favorites));
  }

  isFavorite(file: File) {
    const key = file.name + '_' + file.lastModified;
    return this.favorites.has(key);
  }
}
