let timeP = document.getElementById('time')

let date = new Date();

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  if(h > 12){
    //if its pm
    h =  h -12
    if(m < 10){
      m = '0' + m
       timeP.textContent = h + ":" + m + 'pm' ;
    } else {
      timeP.textContent = h + ":" + m + 'pm' ;
    }
  } else if(h === 0){
    //if its midnight
    h = 12
    if(m < 10){
      m = '0' + m
       timeP.textContent = h + ":" + m + 'am' ;
    } else {
      timeP.textContent = h + ":" + m + 'am' ;
    }

  } else{
    //if its the am 
    if(m < 10){
      m = '0' + m
       timeP.textContent = h + ":" + m + 'am' ;
    } else {
      timeP.textContent = h + ":" + m + 'am' ;
    }
  }
}

setInterval(time, 1000);
