const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
const platform = require('ffbinaries').detectPlatform();

const ext = 'win-64' === platform ? '.exe' : ''

ffmpeg.setFfmpegPath(path.join(__dirname,'ffmpeg' + ext));
ffmpeg.setFfprobePath(path.join(__dirname,'ffprobe' + ext));

exports.ffmpeg = ffmpeg;