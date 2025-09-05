const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {

  const preloadPath = path.join(__dirname, 'preload.js');
  const fs = require('fs');

  console.log('Preload path =', preloadPath);
  console.log('Preload exists =', fs.existsSync(preloadPath));


  // Crée la fenêtre principale
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // Chemin absolu vers le preload.js (doit être à côté de main.js)
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // obligatoire pour sécuriser le renderer
      nodeIntegration: false,   // désactivé pour Angular,
      sandbox: false
    }
  });

  // Ouvre DevTools pour debug
  win.webContents.openDevTools();

  // Charge l'index.html généré par Angular
  // Vérifie le chemin exact après build Angular
  const indexPath = path.join(__dirname, 'dist', 'gallery-viewer', 'browser', 'index.html');
  win.loadFile(indexPath)
    .catch(err => {
      console.error('Erreur lors du chargement de index.html:', err);
    });
}

// Crée la fenêtre quand Electron est prêt
app.whenReady().then(createWindow);

// Quitte proprement sur Mac/Windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // Sur Mac, recrée la fenêtre si aucune n'existe
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
