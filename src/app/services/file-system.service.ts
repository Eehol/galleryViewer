import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileSystemService {

  async pickFolders(): Promise<File[]> {
    const files: File[] = [];
    // On peut choisir plusieurs dossiers (Chrome/Edge)
    // @ts-ignore
   // d est un FileSystemDirectoryHandle
const dirHandles: FileSystemDirectoryHandle[] = await window.showDirectoryPicker({ mode: 'readwrite' })
  .then((d: FileSystemDirectoryHandle) => [d]);


    for (const dirHandle of dirHandles) {
      await this.readDirectoryRecursive(dirHandle, files);
    }

    return files;
  }

  private async readDirectoryRecursive(dirHandle: FileSystemDirectoryHandle, files: File[]) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const fileHandle = entry as FileSystemFileHandle; // <-- cast correct
      const file = await fileHandle.getFile();
      if (/\.(jpe?g|png|gif|mp4|webm)$/i.test(file.name)) {
        files.push(file);
      }
    } else if (entry.kind === 'directory') {
      const subDirHandle = entry as FileSystemDirectoryHandle; // <-- cast correct
      await this.readDirectoryRecursive(subDirHandle, files);
    }
  }
}

}
