const fs = require('fs');

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