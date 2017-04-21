const path = require('path')
const fs = require('fs')
const filesize = require('filesize')
const { logger } = require('../../core/logger')
const { ffmpeg } = require('../../libs/ffmpeg')
const { hash } = require('../../core/hash')

const Video = {
    applyWatermark(file, progress, callback) {    
        const output = path.join(STORAGE_PATH, 'output', hash() + '_output.mp4')

        const m = 50; // margin 50px

        ffmpeg(file.path)
            // .audioCodec('copy')
            .addInput(WATERMARK) // top-left
            .addInput(WATERMARK) // top-right
            .addInput(WATERMARK) // bottom-right
            .addInput(WATERMARK) // left-top-middle
            .addInput(WATERMARK) // left-bottom-middle
            .addInput(WATERMARK) // right-top-middle
            .addInput(WATERMARK) // right-bottom-middle
            .addInput(LOGO) // bottom-right
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
                    inputs: 'right-bottom-middle', 
                    // outputs: 'out'
                },
            ])
            .on('start', (commandLine) => {
                logger.debug(commandLine);
            })
            .on('end', (stdout, stderr) => {
                logger.info('done');
                callback(null, output);
            })
            .on('progress', () => {
                const stat = fs.statSync(output);
                const size = filesize(stat.size)
                logger.info(size);
                progress(size)
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