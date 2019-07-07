
//socket
var socket = io('http://localhost:3001');

  socket.on('connect', function(){
		console.log('connected');
		socket.emit('test')
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
		width: 640,
		height: 200,
		amplitude:0.1,
		speed: .1
	});
	
	recognition.addEventListener('result', e => {

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

		//commands
		if(transcript === 'omega') {
			if(e.results[0].isFinal){
				listening = true;
				lightControl(false, false, 'omega on', false)
				$('.wrapper').addClass('listening');
				//get name
					response(`yes, what do you need ${names}`, 1.5)
				}
			}
			
			if(listening === true || transcript.includes('omega')) {
				$('.wrapper').addClass('listening')
				listening = true;
				
				if(transcript.includes('simon says')){
					if(e.results[0].isFinal){
						let text = transcript.split('says');
						response(text[1], 1.0)
						listening = false
						$('.wrapper').removeClass('listening')
					}
				}
				//Hue Lights ON
				if(transcript.includes('turn on the')){
					if(e.results[0].isFinal){
						lightControl(true, transcript, "on", names);
					}
				}
				//Hue Lights OFF
				if(transcript.includes('turn off the')){
					if(e.results[0].isFinal){
						lightControl(false, transcript, "off", names);
					}
				}
				
				if(transcript.includes('%')){
					if(e.results[0].isFinal){
						lightControl(false, transcript, "set", names);
					}
				}

				if(transcript.includes('is the date') || transcript.includes(`what's the date`)){
					if(e.results[0].isFinal){
						var today = new Date();
						var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
						response(`let's see, the date is... ${date}`, 1.0)
						$('.wrapper').removeClass('listening')
						listening = false
						transcript = ''
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
						$('.wrapper').removeClass('listening')
						listening = false
						response(`let's see, the time is... ${hours} ${min}`, 1.0)
					}
				}

				if(transcript.includes('*') || transcript.includes('-') || transcript.includes('^') || transcript.includes('+') || transcript.includes('/')){
					if(e.results[0].isFinal){
						let math = transcript.split('what is')
						let answer = nerdamer(math[1])
						console.log(answer);
						response(answer, 1.0)
						listening = false;
					}
				}

				// if(transcript.includes('mute')){
				// 	socket.emit('mute')
				// 	socket.on('mute', data => {
				// 		response('muted', 1.0)
				// 		listening = false
				// 	})
				// }

				if(transcript.includes('reload')){
					if(e.results[0].isFinal){
						response('Rebooting Systems...', 1.0)
						location.reload();
					}
				}
			}
			
			if(transcript.includes('stop')){
				if(e.results[0].isFinal){
					speechSynthesis.cancel()
					$('.wrapper').removeClass('listening')	
					listening = false
					console.log(`not listening `);
				}
			}
			console.log(transcript);
			if(listening === false){
				lightControl(false, false, 'omega off', false)
				
			}
		})
		
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
	
	//get the user name

	
	const lightControl = (state, transcript, command, names) => {
		$.get(`https://discovery.meethue.com/`, (data) => {
			let ip = data[0].internalipaddress;
			let url = `http://${ip}/api/pf3enyrZJz4uvwgYf90t9E2FzLM4tW2GeGSnO-ut/lights` 
			$.get(url, lights => {

				if(transcript !== false){
					let transSplit = transcript.split('the')
					let lightFromCommand = transSplit[1]

					
					let array = []
					for(let i = 1; i <= Object.keys(lights).length; i++){
						array.push({"name": lights[i].name, "index": i})
					}
					var options = {
						shouldSort: true,
						threshold: 0.6,
						location: 0,
						distance: 100,
						maxPatternLength: 32,
						minMatchCharLength: 1,
						keys: [
							"name",
						]
					};
					console.log(`💡 ${array}`);
					var fuse = new Fuse(array, options)
					light = fuse.search(lightFromCommand)
					
				console.log(light);
			}
				
				if(command === 'on'){

					let data = {on: state}
	
					$.ajax({
						url: `${url}/${light[0].index}/state`,
						type: 'PUT',
						data: JSON.stringify(data), 
						success: function() {
							response('yes, doing that now', 1.0)
							
						}
					});
				}
				if(command === 'off'){

					let data = {on: state}
	
					$.ajax({
						url: `${url}/${light[0].index}/state`,
						type: 'PUT',
						data: JSON.stringify(data), 
						success: function() {
							response('yes, doing that now', 1.0)
							lightControl(false, false, 'omega off', false)	
						}
					});
				}
				if(command === 'set'){
					let int = transcript.replace( /[^\d.]/g, '' );
					console.log(int);
					let percentage = (parseInt(int) / 100)
					let briVal = (254 * percentage)
					
					let data = {bri: briVal}
					$.ajax({
						url: `${url}/${light[0].index}/state`,
						type: 'PUT',
						data: JSON.stringify(data), 
						success: function() {
							response('yes, doing that now', 1.0)
							
						}
					});
					
				}
				
				if(command === 'omega on'){
					console.log('omega on');
					
					let data = {hue: 0}
					$.ajax({
						url: `${url}/3/state`,
						type: 'PUT',
						data: JSON.stringify(data), 
						success: function() {
							console.log("💡 listening");
						}
					});
					
				}

				if(command === 'omega off'){
					let data = {hue: 41770}
					$.ajax({
						url: `${url}/3/state`,
						type: 'PUT',
						data: JSON.stringify(data), 
						success: function() {
							console.log("💡 off");
						}
					});
					
				}

			})
		})
		$('.wrapper').removeClass('listening')
		listening = false
	}
	
	recognition.addEventListener('end', recognition.start)
	recognition.start();
	
});