const simon = {
  main: (transcript) => {
    
    if(transcript.includes('simon says')){
      let text = transcript.split('says');
      return {finished: true, speech: text[1]}
    }
  }
} 

module.exports = simon;