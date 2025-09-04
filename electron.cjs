// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  // Créer la fenêtre du navigateur.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Charger l'application React.
  // En développement, elle pointe vers votre serveur Vite.
  // En production, elle pointe vers le fichier build de votre application.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:8080' // Assurez-vous que le port correspond à celui de Vite
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Ouvrir les DevTools si en mode développement.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Sur macOS, il est courant de recréer une fenêtre dans l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});