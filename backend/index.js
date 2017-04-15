const { ipcMain } = require('electron')
const { Video } = require('./services/Video')
const { logger } = require('../core/logger')

let queueIsWaiting = true;
const queue = [];

function startQueue(e) {
    if (!queueIsWaiting) return;
    queueIsWaiting = false;

    (function loop(e) {
        const file = queue.shift();
        
        if (!file) {
            queueIsWaiting = true;
            return;
        }

        const finished = (err, res) => {
            if (err) {
                e.sender.send('file:error', err)
            } else {
                file.isHaveWatermark =  true;
                file.output = res;
                e.sender.send('file:finish', {err, res: file})
                
                if (queue.length) loop(e);
            }
        }

        switch(file.type) {
            case 'video':
                Video.applyWatermark(file, finished);
                break;
            default:
                throw new Error(`${file.type} invalid`);
        }
    })(e)

    
}

function backend() {
    ipcMain.on('queue:add', (e, newFile) => {  

        

        queue.push(newFile);
        if (queueIsWaiting) startQueue(e);

        // const progress = (res) => {
        //     e.sender.send('video:progress', res)
        // }

        

        
    })
}

exports.backend = backend