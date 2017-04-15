const { ipcMain } = require('electron')
const { Video } = require('./services/Video')

const queue = [];

function backend() {
    ipcMain.on('queue:add', (e, newFile) => {  

        const finished = (err, res) => {
            if (err) {
                e.sender.send('file:error', err)
            } else {
                file.isHaveWatermark =  true;
                file.output = res;
                e.sender.send('file:finish', {err, res: file})
            }
        }

        queue.push(newFile);
        const file = queue.shift()

        switch(file.type) {
            case 'video':
                Video.applyWatermark(file, finished);
                break;
            default:
                throw new Error(`${file.type} invalid`);
        }

        // const progress = (res) => {
        //     e.sender.send('video:progress', res)
        // }

        

        
    })
}

exports.backend = backend