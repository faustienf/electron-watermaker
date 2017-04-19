const path = require('path')
const { copy } = require('../../core/fs')
const { hash } = require('../../core/hash')

const ImageController = {
    save: (e, file) => {  
        const output = path.join(STORAGE_PATH, 'output', hash() + '_output.jpg')

        const base64Data = file.base64.replace(/^data:image\/(png|jpeg);base64,/, '');

        require('fs').writeFile(
            output, 
            base64Data, 
            'base64', (err) => {
                if (err) throw new Error(err)
                
                file.output = output
                file.isHaveWatermark =  true;
                
                e.sender.send('file:finish', {err, res: file})
        })
    }
}

exports.ImageController = ImageController;