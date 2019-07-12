const time = {
  main: (transcript, socket) => {
    
    if(transcript.includes('time is it') || transcript.includes('is the time')){
          // showText(transcript)
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var hours = today.getHours();
          var min = today.getMinutes().toString().split('');
          if(min[0] === '0'){
            min = `o ${min[1]}`
          } else {
            min = min.join('')
          }
          // $('.wrapper').removeClass('listening')
          // listening = false
          // response(`let's see, the time is... ${hours} ${min}`, 1.0)
          let x = {finished: true, speech:`let's see, the time is... ${hours} ${min}`} 
          socket.emit('commandDone', x)
      }
  }
} 

module.exports = time;