const path = require("path");
const { app, BrowserWindow } = require("electron");

let mainWindow;
let splash;
const SPLASH_MIN_MS = 8000;

function createWindow() {
  const appIcon = path.join(__dirname, "assets", "logo", "start-icon.png");

  // Splash Window
  splash = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splash.loadFile("splash.html");

  // Auth/Main Window (hidden initially)
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("login.html");

  // Keep splash visible for at least 8 seconds, then show login.
  setTimeout(() => {
    if (splash && !splash.isDestroyed()) {
      splash.close();
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  }, SPLASH_MIN_MS);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
