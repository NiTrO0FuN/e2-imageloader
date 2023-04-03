/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  transformImage: (file) => ipcRenderer.send("tranformImage", file.path),
  transformImageFeedbackHandler: (handler) =>
    ipcRenderer.once("tranformImageFeedback", handler),
  transformImageDone: (handler) =>
    ipcRenderer.on("transformImageDone", handler),
  openDirectoryDialog: () => ipcRenderer.invoke("dialog:openDirectory"),
  updateGMODPath: (path) => ipcRenderer.send("updateGMODPath", path),
  isGMODPathValid: () => ipcRenderer.send("isGMODPathValid"),
  isGMODPathValidFeedbackHandler: (handler) => {
    ipcRenderer.removeAllListeners("isGMODPathValidFeedback");
    ipcRenderer.on("isGMODPathValidFeedback", handler);
  },
  chooseActiveImage: (name) => ipcRenderer.invoke("chooseActiveImage", name),
  deleteSavedImage: (name, data) =>
    ipcRenderer.send("deleteSavedImage", name, data),
  publicFolder: (handler) => ipcRenderer.on("publicFolder", handler),
});
