const { ipcMain } = require('electron')
const { Video } = require('./services/Video')
const { logger } = require('../core/logger')
const { copy } = require('../core/fs')

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
function getInitialState() {
    return {
        logo: LOGO,
        watermark: WATERMARK
    }
}

function backend() {
    ipcMain.on('assets:save', (e, file) => {  
        const output = file.type === 'logo'
            ? LOGO
            : WATERMARK

        copy(file.path, output, () => {
            e.sender.send('assets:saved')
        });
    })

    ipcMain.on('state:get', e => {  
        e.sender.send('state:send', getInitialState())       
    })

    ipcMain.on('queue:add', (e, newFile) => {  
        queue.push(newFile);
        if (queueIsWaiting) startQueue(e);        
    })
    
}

exports.backend = backend