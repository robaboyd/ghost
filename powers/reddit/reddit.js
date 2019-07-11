const reddit = {
  main: (transcript) => {
      if (transcript.includes('reddit')) {
          return {finished: true, speech: `let's see, the date is... ${date}`}
      }
  }
}

module.exports = reddit;