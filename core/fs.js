const fs = require('fs')
const path = require('path')

exports.copy = function(source, target, callback) {
    let callbackCalled = false;

    const rd = fs.createReadStream(source);
        rd.on('error', err => {
        done(err);
    });

    const wr = fs.createWriteStream(target);
    wr.on('error', err => {
        done(err);
    }).on('close', () => {
        done();
    });

    rd.pipe(wr);

    function done(err = null) {
        if (!callbackCalled) {
            callback(err);
            callbackCalled = true;
        }
    }
}

exports.fileIs = function(type, filename) {
    switch(type) {
        case 'image':
            return !!path.extname(filename).match(/\.(jpe?g|png|gif)/i)
        case 'video':
            return !!path.extname(filename).match(/\.(avi|mp4)/i)
        default:
            throw new Error(`invalid type ${type}`)
    }
}