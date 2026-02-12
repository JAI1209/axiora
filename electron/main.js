const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} = require("./secureStore");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "login.html"));
}

ipcMain.handle("secureStore:getAccessToken", () => getAccessToken());
ipcMain.handle("secureStore:getRefreshToken", () => getRefreshToken());
ipcMain.handle("secureStore:setTokens", (_event, accessToken, refreshToken) =>
  setTokens(accessToken, refreshToken)
);
ipcMain.handle("secureStore:clearTokens", () => clearTokens());

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
