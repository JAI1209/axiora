const { contextBridge, ipcRenderer } = require("electron");

const API_BASE_URL = process.env.AXIORA_API_BASE_URL || "http://localhost:5000";

contextBridge.exposeInMainWorld("secureStore", {
  getAccessToken: () => ipcRenderer.invoke("secureStore:getAccessToken"),
  getRefreshToken: () => ipcRenderer.invoke("secureStore:getRefreshToken"),
  setTokens: (accessToken, refreshToken) =>
    ipcRenderer.invoke("secureStore:setTokens", accessToken, refreshToken),
  clearTokens: () => ipcRenderer.invoke("secureStore:clearTokens"),
});

contextBridge.exposeInMainWorld("appConfig", {
  apiBaseUrl: API_BASE_URL,
});
