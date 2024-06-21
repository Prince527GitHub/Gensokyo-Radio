const { app, BrowserWindow, Tray, Menu } = require("electron");
const axios = require("axios");
const path = require("path");

if (require("electron-squirrel-startup")) {
    app.quit();
}

let mainWindow = null;
let tray = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 362,
        height: 587,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        resizable: false,
        fullscreenable: false,
        maximizable: false
    })

    mainWindow.setIcon(path.join(__dirname, "img/logo.png"));
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    mainWindow.on("ready-to-show", () => mainWindow.show());

    tray = new Tray(path.join(__dirname, "img/logo.png"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show/Hide",
            click: () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        },
        {
            label: "Quit",
            click: () => app.quit()
        }
    ]);

    tray.setToolTip("Music Player");
    tray.setContextMenu(contextMenu);

    tray.on("click", () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show());
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on("ready", discordRPC);

async function discordRPC() {
    const DiscordRPC = require("discord-rpc");

    const rpc = new DiscordRPC.Client({ transport: "ipc" });

    rpc.login({ clientId: "1253772057926303804" }).catch(console.error);

    async function setActivity() {
        if (!rpc || !mainWindow) return;

        const current = (await axios("https://gensokyoradio.net/api/station/playing/")).data;

        rpc.setActivity({
            details: current.SONGINFO.TITLE,
            state: current.SONGINFO.ARTIST,
            startTimestamp: Date.now(),
            endTimestamp: new Date(Date.now() + (current.SONGTIMES.REMAINING * 1000)),
            largeImageKey: `https://gensokyoradio.net/images/albums/500/${current.MISC.ALBUMART}`,
            largeImageText: current.SONGINFO.ALBUM,
            smallImageKey: "large_logo",
            smallImageText: "Gensokyo Radio",
        });
    }

    rpc.on("ready", () => {
        setActivity();

        setInterval(() => {
            setActivity();
        }, 15e3);
    });
}