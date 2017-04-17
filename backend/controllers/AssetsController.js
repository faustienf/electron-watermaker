const { copy } = require('../../core/fs')

const AssetsController = {
    save: (e, file) => {  
        const output = file.type === 'logo'
            ? LOGO
            : WATERMARK

        copy(file.path, output, () => {
            e.sender.send('assets:saved')
        })
    }
}

exports.AssetsController = AssetsController;