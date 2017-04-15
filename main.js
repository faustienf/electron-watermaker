const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

global.IS_DEV = process.env.NODE_ENV === 'development'
global.BASE_PATH = __dirname
global.DATA_PATH = path.join(__dirname, 'data')
global.STORAGE_PATH = path.join(__dirname, 'storage')

const storageFolders = [
  global.STORAGE_PATH,
  path.join(STORAGE_PATH, 'logs'),
  path.join(STORAGE_PATH, 'output')
]
storageFolders.map(folder => {
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
})

const { backend } = require('./backend')

backend();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1400, height: 800})

  
  if (IS_DEV) {
    const VUE_EXT_PATH = '/home/alex/.config/google-chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.1.2_0';
    BrowserWindow.addDevToolsExtension(VUE_EXT_PATH);
    win.webContents.openDevTools()
  } else {
    win.webContents.openDevTools()
    win.setMenu(null);
  }
  
  

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

