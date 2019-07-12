const date = {
    main: (transcript, socket) => {
        if (transcript.includes('is the date') || transcript.includes(`what's the date`)) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            let x = {finished: true, speech: `let's see, the date is... ${date}`}
            socket.emit('commandDone', x)
        }
    }
}

module.exports = date;