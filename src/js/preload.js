const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    setPaused: (state) => ipcRenderer.send("set-paused", state)
});