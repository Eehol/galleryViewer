import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private path = 'C:\\Users\\Vince\\AppData\\Roaming\\GalleryViewer\\favorites.json';

  constructor() {
    this.initFavoritesFile();
  }

  private waitForElectronAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('electronAPI introuvable'), 5000);
      const interval = setInterval(() => {
        if ((window as any).electronAPI) {
          clearTimeout(timeout);
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  private async initFavoritesFile() {
    try {
      await this.waitForElectronAPI();

      const folder = window.electronAPI.pathDirname(this.path);
      window.electronAPI.mkdir(folder);

      if (!window.electronAPI.exists(this.path)) {
        window.electronAPI.writeFile(this.path, '[]');
        console.log('favorites.json créé !');
      } else {
        console.log('favorites.json déjà existant');
      }
    } catch (e) {
      console.error('Erreur initFavoritesFile:', e);
    }
  }

  save(favorites: string[]) {
    try {
      if (window.electronAPI) {
        window.electronAPI.writeFile(this.path, JSON.stringify(favorites, null, 2));
      }
    } catch (e) {
      console.error('Erreur save favorites:', e);
    }
  }

  load(): string[] {
    try {
      if (window.electronAPI) {
        const content = window.electronAPI.readFile(this.path);
        return content ? JSON.parse(content) : [];
      }
    } catch (e) {
      console.error('Erreur load favorites:', e);
    }
    return [];
  }
}
