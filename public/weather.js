let apiKey = '49bf6b078523a45615ccb91d51d62a07'
let city = 'Rocklin'
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
let weatherP = document.getElementById('weather')

const weather = () => {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: "json",
    success: function (result, status, xhr) {
      console.log(result.weather[0].main);
      let temp = result.main.temp.toString().split('.')[0]
      if (parseInt(temp) > 90) {
        weatherP.textContent = `😰 ${city} ${result.main.temp.toString().split('.')[0]}°F `
      } else if (parseInt(temp) > 80 && result.weather[0].main !== "Rain") {
        weatherP.textContent = `🌤 ${city} ${result.main.temp.toString().split('.')[0]}°F `
      } else if (parseInt(temp) > 70 && result.weather[0].main !== "Rain") {
        weatherP.textContent = `😎 ${city} ${result.main.temp.toString().split('.')[0]}°F `
      } else if (parseInt(temp) > 50 && parseInt(temp) < 70) {
        weatherP.textContent = `☁ ${city} ${result.main.temp.toString().split('.')[0]}°F `
      } else if (parseInt(temp) < 50 && result.weather[0].main !== "Rain") {
        weatherP.textContent = `❄ ${city} ${result.main.temp.toString().split('.')[0]}°F `
      }
    }
  })
}
weather()
setInterval(weather, 60000);

