const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 362,
    height: 587,
    autoHideMenuBar: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false
  });

  const icon = path.join(__dirname, "img/logo.png");

  // and load the index.html of the app.
  mainWindow.setIcon(icon);
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  const tray = new Tray(icon);

  tray.setToolTip("Gensokyo Radio");
  tray.setContextMenu(Menu.buildFromTemplate([
    {
        label: "Show/Hide",
        click: () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    },
    {
        label: "Quit",
        click: () => app.quit()
    }
  ]));

  tray.on("click", () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const { Client } = require("@xhayper/discord-rpc");

app.on("ready", () => {
  const client = new Client({ clientId: "1253772057926303804" });

  async function setActivity() {
    const song = await (await fetch("https://gensokyoradio.net/api/station/playing/")).json();

    client.user?.setActivity({
      details: song.SONGINFO.TITLE,
      state: song.SONGINFO.ARTIST,
      startTimestamp: new Date(song.SONGTIMES.SONGSTART),
      endTimestamp: new Date(song.SONGTIMES.SONGEND),
      largeImageKey: song.MISC.ALBUMART ? `https://gensokyoradio.net/images/albums/500/${song.MISC.ALBUMART}` : "undefined",
      largeImageText: song.SONGINFO.ALBUM,
      smallImageKey: "logo",
      smallImageText: "Gensokyo Radio",
      type: 2
    });
  }

  client.on("ready", () => {
    setActivity();

    setInterval(() => {
        setActivity();
    }, 15e3);
  });

  client.login();
});
