function getInitialState() {
    return {
        logo: LOGO,
        watermark: WATERMARK
    }
}


const StateController = {
    get: (e) => {  
        e.sender.send('state:send', getInitialState())
    }
}

exports.StateController = StateController;