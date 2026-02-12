const Store = require("electron-store");
const { app } = require("electron");

const DEFAULT_DEV_KEY = "axiora-dev-key-change-me";
const encryptionKey = process.env.AXIORA_STORE_KEY || DEFAULT_DEV_KEY;

if (app.isPackaged && encryptionKey === DEFAULT_DEV_KEY) {
  throw new Error("AXIORA_STORE_KEY must be set in production");
}

const store = new Store({
  name: "axiora",
  encryptionKey,
});

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

const getAccessToken = () => store.get(ACCESS_TOKEN_KEY, null);
const getRefreshToken = () => store.get(REFRESH_TOKEN_KEY, null);
const setTokens = (accessToken, refreshToken) => {
  store.set(ACCESS_TOKEN_KEY, accessToken);
  store.set(REFRESH_TOKEN_KEY, refreshToken);
  return true;
};
const clearTokens = () => {
  store.delete(ACCESS_TOKEN_KEY);
  store.delete(REFRESH_TOKEN_KEY);
  return true;
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};
