import {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  dialog,
  protocol,
} from "electron";
import path from "path";
import os from "os";
import { receiveImage } from "./image-processing";
import { setGPath, isGPathValid, isActualGPathValid } from "./storage";
import { chooseActiveImage, deleteSavedImage } from "./file_gestion";
const url = require("url");

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    autoHideMenuBar: true,
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.whenReady().then(() => {
  protocol.registerFileProtocol("polite", (request, callback) => {
    const filePath = url.fileURLToPath(
      "file://" + request.url.slice("polite://".length)
    );

    callback(filePath);
  });
});

// IPC communication
ipcMain.on("tranformImage", async (event, path) => {
  await receiveImage(path, mainWindow.webContents);
});

ipcMain.handle("dialog:openDirectory", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  if (canceled) {
    return false;
  } else {
    let choosenDirectory = filePaths[0];
    if (isGPathValid(choosenDirectory)) {
      setGPath(filePaths[0]);
      mainWindow.webContents.send(
        "isGMODPathValidFeedback",
        isActualGPathValid()
      );
      return filePaths[0];
    }
    return "Wrong directory";
  }
});

ipcMain.on("updateGMODPath", (event, path) => {
  if (isGPathValid(path)) {
    setGPath(path);
    mainWindow.webContents.send(
      "isGMODPathValidFeedback",
      isActualGPathValid()
    );
  }
});

ipcMain.on("isGMODPathValid", () => {
  mainWindow.webContents.send("isGMODPathValidFeedback", isActualGPathValid());
});

ipcMain.handle("chooseActiveImage", (event, name) => {
  return chooseActiveImage(name);
});

ipcMain.on("deleteSavedImage", (event, name, data) => {
  deleteSavedImage(name, data);
});
