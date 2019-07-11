const date = {
    main: (transcript) => {
        if (transcript.includes('is the date') || transcript.includes(`what's the date`)) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            return {finished: true, speech: `let's see, the date is... ${date}`}
        }
    }
}

module.exports = date;