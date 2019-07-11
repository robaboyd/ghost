//TODO Draggable UI
let p = document.createElement('p')
const words = document.querySelector('.transcript')

//socket
var socket = io('http://localhost:3001');

socket.on('connect', function(){
	console.log('connected');
	//get weather
	
	//speech recognition
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	
	var Omega = new SpeechSynthesisUtterance();
	
	const recognition = new SpeechRecognition();

	recognition.interimResults = true;
	
	let listening = false;
	let names = ""

	var siriWave = new SiriWave({
		container: document.getElementById('siri-container'),
		style: "ios9",
		autostart: true, 
		width: 440,
		height: 150,
		amplitude:0.1,
		speed: .1
	});
	
	recognition.addEventListener('result', e => {
		console.log(listening);

		let transcript = Array.from(e.results)
		.map(result => result[0])
		.map(result => result.transcript)
		.join('')

		transcript = transcript.toLowerCase();

		//get names	
		socket.emit('getname')
		socket.on('getname', data => {
			names = data
		})

		// socket.on('showCommand', data=> {
		// 	showText(transcript)
		// })
		
		//if the transcript is just omega
		if(listening === true || transcript.includes('omega')) {
			$('.wrapper').addClass('listening');
			socket.emit('lightActivate', null)	
			//send messages to the server to run the scripts
			if(e.results[0].isFinal){
				socket.emit('commandSent', transcript)
			}
		}	
		if(transcript === 'omega'){
			console.log('just omega');
			if(e.results[0].isFinal){
				$('.wrapper').addClass('listening');
				listening = true
				socket.emit('lightActivate', null)	
				response(`yes, what do you need ${names}`, 1.5)
			}
		}
		//on command done
		socket.on('commandDone', data => {
			//end
			console.log('command done');
			$('.wrapper').removeClass('listening')	
				socket.emit('lightsDeactivate', null)
				// if(data !== null){
				// 	listening = false
				// } else {
				// 	response('nevermind then', 1.0)
					
				// }
				if(data !== null){

					response(data.speech, 1.0)
				}
				listening = false
		})

		//on power run
		socket.on('powerRun', (data) => {
			console.log(`🤖 ${JSON.stringify(data)}`);
		})
			
			if(transcript.includes('stop')){
				if(e.results[0].isFinal){
					speechSynthesis.cancel()
					$('.wrapper').removeClass('listening')	
					listening = false
					console.log(`not listening `);
				}
			}

			if(e.results[0].isFinal){
				console.log(transcript);
			}
		
		})
		
		const response = (text, rate) => {
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
		
		hideText()
	}
	
	//get the user name

	const showText = (transcript) => {
		p.textContent= transcript
		words.appendChild(p)
		$('.transcript').css({opacity: 1, transition: 'all .5s ease'})
	}
	
	const hideText = () => {
		setTimeout(() => {
			p.textContent = ''
			$('.transcript').css({opacity: 1, transition: 'all .5s ease'})
		}, 2000)
	}
	recognition.addEventListener('end', recognition.start)
	recognition.start();
	
});