const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');


console.log('Preload chargé ✅');


contextBridge.exposeInMainWorld('electronAPI', {
  writeFile: (filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Fichier écrit: ${filePath}`);
    } catch (e) {
      console.error('Erreur writeFile:', e);
      throw e; // remonte l’erreur côté Angular
    }
  },
  readFile: (filePath) => {
    try {
      return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
    } catch (e) {
      console.error('Erreur readFile:', e);
      return null;
    }
  },
  exists: (filePath) => fs.existsSync(filePath),
  mkdir: (folderPath) => {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Dossier créé: ${folderPath}`);
      }
    } catch (e) {
      console.error('Erreur mkdir:', e);
      throw e;
    }
  },
  pathDirname: (filePath) => path.dirname(filePath)
});
