'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;



app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 400,
        resizable: false,
        width: 1000
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var ipcMain = electron.ipcMain;
var open = require("open");
ipcMain.on('close-main-window', function () {
    app.quit();
});
ipcMain.on('open-home', function () {
    open(home);
});