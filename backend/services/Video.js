const path = require('path')
const { logger } = require('../../core/logger')
const { ffmpeg } = require('../../libs/ffmpeg')

function hash() {
    return Math.random().toString(36).substring(6);
}

const Video = {
    applyWatermark(file, callback) {    
        const watermark = path.join(STORAGE_PATH, 'data', 'ni_watermark.png');
        const logo = path.join(STORAGE_PATH, 'data', 'ni_logo.png');
        const output = path.join(STORAGE_PATH, 'output', hash() + '_output' + path.extname(file.path))

        logger.debug(output);

        const m = 50; // margin 50px

        ffmpeg(file.path)
            .audioCodec('copy')
            .addInput(watermark) // top-left
            .addInput(watermark) // top-right
            .addInput(watermark) // bottom-right
            .addInput(watermark) // left-top-middle
            .addInput(watermark) // left-bottom-middle
            .addInput(watermark) // right-top-middle
            .addInput(watermark) // right-bottom-middle
            .addInput(logo) // bottom-right
            .complexFilter([
                {
                    filter: 'overlay', options: {
                        x: m,
                        y: m,
                    },
                    outputs: 'top-left'
                },
                {
                    filter: 'overlay', options: {
                        x: `W-w-${m}`,
                        y: m,
                    },
                    inputs: 'top-left', outputs: 'top-right'
                },
                {
                    filter: 'overlay', options: {
                        x: m,
                        y: `H-h-${m}`,
                    },
                    inputs: 'top-right', outputs: 'bottom-right'
                },
                {
                    filter: 'overlay', options: {
                        x: `W/4+${m}`,
                        y: `H/4+${m}`,
                    },
                    inputs: 'bottom-right', outputs: 'left-top-middle'
                },
                {
                    filter: 'overlay', options: {
                        x: `W/4+${m}`,
                        y: `H-H/4-h-${m}`,
                    },
                    inputs: 'left-top-middle', outputs: 'left-bottom-middle'
                },
                {
                    filter: 'overlay', options: {
                        x: `W-W/4-h-${m}`,
                        y: `H/4+${m}`,
                    },
                    inputs: 'left-bottom-middle', outputs: 'right-top-middle'
                },
                {
                    filter: 'overlay', options: {
                        x: `W-W/4-h-${m}`,
                        y: `H-H/4-h-${m}`,
                    },
                    inputs: 'right-top-middle', outputs: 'right-bottom-middle'
                },
                {
                    filter: 'overlay', options: {
                        x: `W-w-${m}`,
                        y: `H-h-${m}`,
                    },
                    inputs: 'right-bottom-middle', outputs: 'output'
                },
            ], 'output')
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