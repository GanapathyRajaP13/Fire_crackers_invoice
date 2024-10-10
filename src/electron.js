const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let mainWindow;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "../public/Firecrackers.ico"),
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow
      .loadURL("http://localhost:5173")
      .then(() => mainWindow.webContents.openDevTools())
      .catch((err) => console.error("Failed to load localhost:", err));
  } else {
    mainWindow
      .loadFile(path.join(__dirname, "../dist/index.html"))
      .catch((err) => console.error("Failed to load index.html:", err));
  }

  mainWindow.setMenu(null);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
