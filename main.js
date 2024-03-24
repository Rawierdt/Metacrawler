const { app, BrowserWindow, ipcMain, dialog, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
let mainWindow;
let tray;

function createWindow() {
    win = new BrowserWindow({
        width: 350,
        height: 420,
        autoHideMenuBar: true,
        frame: true,
        movable: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        titleBarOverlay: true,
        disableDialogs: true,
        navigateOnDragDrop: true,
        icon: path.join(__dirname, '/src/img/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('./src/views/main.html');
}

app.whenReady().then(() => {
    createWindow();
    tray = new Tray(path.join(__dirname, '/src/img/icon.png'));
    tray.setToolTip('Metacrawler 2');
    tray.on('click', () => {
        mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('download-file', (event, filePath) => {
    dialog.showSaveDialog(win, {
        defaultPath: filePath
    }).then(result => {
        if (!result.canceled) {
            fs.copyFile(filePath, result.filePath, err => {
                if (err) {
                    console.error(err);
                } else {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
        }
    });
});

ipcMain.on('minimize-window', () => {
    if (win) {
        win.minimize();
    }
});

ipcMain.on('close-window', () => {
    if (win) {
        win.close();
    }
});
