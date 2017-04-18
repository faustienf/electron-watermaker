const { FileController } = require('./controllers/FileController')
const { AssetsController } = require('./controllers/AssetsController')
const { StateController } = require('./controllers/StateController')
const { QueueController } = require('./controllers/QueueController')

function backend() {
    ipcMain.on('file:export', FileController.export)
    ipcMain.on('assets:save', AssetsController.save)
    ipcMain.on('state:get', StateController.get)
    ipcMain.on('queue:add', QueueController.add)
}

exports.backend = backend