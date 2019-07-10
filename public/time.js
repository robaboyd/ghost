let timeP = document.getElementById('time')

let date = new Date();

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  if(h > 12){
    h =  h -12
    if(m < 10){
      m = '0' + m
       timeP.textContent = h + ":" + m + 'pm' ;
    } else {
      timeP.textContent = h + ":" + m + 'pm' ;
    }
  } else {
    if(m < 10){
      m = '0' + m
       timeP.textContent = h + ":" + m + 'pm' ;
    } else {
      timeP.textContent = h + ":" + m + 'pm' ;
    }
  }
}

setInterval(time, 1000);

// dateP.innerHTML = date.toLocaleDateString();