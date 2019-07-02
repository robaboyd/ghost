import React, {useState, useEffect} from 'react';
import './App.css';
import SiriWave from 'siriwave';
import SpeechRecognition from "react-speech-recognition";
function App() {
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

	var Omega = new SpeechSynthesisUtterance();
	
	const recognition = new SpeechRecognition();
  const [listening, setListening] = useState(false)
  // console.log(recognition.started);
  const [transcript, setTranscript] = useState('')
  //siri wave
  var siriWave = new SiriWave({
		container: document.getElementById('siri-container'),
		style: "ios9",
		autostart: true, 
		width: 640,
		height: 200,
		amplitude:0.1,
		speed: .1
  });
  
    recognition.addEventListener('result', e => {
    console.log('Listen');
    let transcript = Array.from(e.results)
			.map(result => result[0])
			.map(result => result.transcript)
			.join('')
			transcript = transcript.toLowerCase();
      console.log(transcript);
			if(transcript === 'omega') {
				if(e.results[0].isFinal){
          response('yes, what do you need', 1.5)
          setListening(true)
				}
			}

			if(listening === true || transcript.includes('omega')) {

				if(transcript.includes('simon says')){
					if(e.results[0].isFinal){
						console.log('repeating...')
						let text = transcript.split('says');
						console.log(text[1]);
						console.log(`not listening `);
						response(text[1], 1.0)
					}
				}
				
				if(transcript.includes('is the date') || transcript.includes(`what's the date`)){
					if(e.results[0].isFinal){
						var today = new Date();
						var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
						response(`let's see, the date is... ${date}`, 1.0)
					}
				}
				
				if(transcript.includes('time is it') || transcript.includes('is the time')){
					if(e.results[0].isFinal){
						var today = new Date();
						var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						var hours = today.getHours();
						var min = today.getMinutes().toString().split('');
						if(min[0] === '0'){
							min = `o ${min[1]}`
						} else {
							min = min.join('')
						}
						console.log(`not listening `);
						response(`let's see, the time is... ${hours} ${min}`, 1.0)
					}
				}
			}
			
			if(transcript.includes('stop')){
				if(e.results[0].isFinal){
					speechSynthesis.cancel()
					console.log(`not listening `);
					}
			}
  })
  
  // useEffect(() => {
    // },[])


    const response = (text, rate,) => {
      console.log(`Speaking... ${text}`);
			siriWave.amplitude = 2
			siriWave.speed = .4
      
      Omega.text = text;
      Omega.lang = 'en-US';
      Omega.rate = rate;
      Omega.onend = function(event) {
			siriWave.amplitude = 0.1
			siriWave.speed = .1
			speechSynthesis.cancel() 
		
		}
		
		speechSynthesis.speak(Omega);
    
		return text
	}
	
	//webcam
	let video = document.getElementById('video')
	 navigator.getUserMedia({video:{}}, stream => video.srcObject = stream, err => console.error(err))
  
  // recognition.addEventListener('end', recognition.start)
  // recognition.start();
  return (
    <div className="App">
      {transcript}
      <div id="siri-container"></div>
			<div className="cam">
				<video id='video' width='720' height='560' autoplay muted></video>
			</div>
    </div>
  );
}

export default App;
