const { copy } = require('../../core/fs')

const FileController = {
    export: (e, file) => {  
        copy(file.output, file.input, () => {
            e.sender.send('file:exported')
        })
    }
}

exports.FileController = FileController;