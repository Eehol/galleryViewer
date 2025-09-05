import { Component } from '@angular/core';
import { FileSystemService } from '../../services/file-system.service';

@Component({
  selector: 'app-folder-selector',
  standalone: true,
  template: `
    <button mat-raised-button color="primary" (click)="openFolder()">
      Choisir un dossier
    </button>
  `,
})
export class FolderSelectorComponent {
  constructor(private fs: FileSystemService) {}

  async openFolder() {
    const files = await this.fs.pickFolders();
    console.log('Fichiers chargés:', files);
  }
}
