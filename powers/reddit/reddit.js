const fs = require('fs')
const path = require('path')
const axios = require('axios')
const reddit = {

  main: (transcript, socket) => {
      let ui = {
        //create module ui here 
        name: "Reddit",
        maxWidth: "400px",
        maxHeight: "700px"
      }

      if (transcript.includes('reddit')) {
        axios.get('https://www.reddit.com/.json').then(data => {
          console.log('get reddit done');
          //maybe send html instead of data?
          socket.emit('powerRun', data.data)
        })
        //send to file maybe? seems weird
          // return {finished: true, speech: `let's see, the date is... ${date}`}
      }
  }
}

module.exports = reddit;