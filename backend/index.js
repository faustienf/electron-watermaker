const { ipcMain } = require('electron')
const { FileController } = require('./controllers/FileController')
const { AssetsController } = require('./controllers/AssetsController')
const { StateController } = require('./controllers/StateController')
const { VideoController } = require('./controllers/VideoController')
const { ImageController } = require('./controllers/ImageController')

function backend() {
    ipcMain.on('file:export', FileController.export)
    ipcMain.on('assets:save', AssetsController.save)
    ipcMain.on('state:get', StateController.get)
    ipcMain.on('video:save', VideoController.save)
    ipcMain.on('image:save', ImageController.save)
}

exports.backend = backend