const axios = require('axios')
let apiKey = '49bf6b078523a45615ccb91d51d62a07'
let city = 'rocklin'
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
const weather = {
  main: (transcript) => {
    if(transcript.includes('temperature')){

      //need to figure out how to get omega to speak from here
      axios.get(url).then(data => {
        console.log(socket);
      })
    }
  }
}

module.exports = weather;