const path = require('path')
const { logger } = require('../../core/logger')
const { ffmpeg } = require('../../libs/ffmpeg')

function hash() {
    return Math.random().toString(36).substring(6);
}

const Video = {
    applyWatermark(file, callback) {    
        const chunks = file.path.split('.');   
        const ext = chunks[chunks.length - 1];

        const watermark = path.join(STORAGE_PATH, '', 'draft.png');
        const output = path.join(STORAGE_PATH, 'output', hash() + '_output.' + ext)

        ffmpeg(file.path)
            .audioCodec('copy')
            .addInput(watermark)
            .complexFilter([
                'overlay=10:10',
            ])
            .on('start', (commandLine) => {
                logger.debug(commandLine);
            })
            .on('end', (stdout, stderr) => {
                logger.info('SUCCESSFUl');
                callback(null, output);
            })
            .on('error', (err) => {
                throw new Error(err.message);
                logger.error('An error occurred: ' + err.message);
                callback(err);
            })
            .save(output);
    }
}


exports.Video = Video;