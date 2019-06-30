//speech recognition
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

	var Omega = new SpeechSynthesisUtterance();
	
	const recognition = new SpeechRecognition();

	recognition.interimResults = true;

	let listening = false;

	let video = document.getElementById('video')

	const startVideo = () =>{
		navigator.getUserMedia({video:{}}, stream => video.srcObject = stream, err => console.error(err))
	}

	//face rec-------------------------------------------------------------------------------------


	Promise.all([
		faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
		faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
		faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
		faceapi.nets.faceExpressionNet.loadFromUri('/models'),
		faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
	]).then(startVideo)

	video.addEventListener('play', async () => {

		// const labeledFaceDescriptors = loadLabeledImages()
		// const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, .6)
		const canvas = faceapi.createCanvasFromMedia(video)
		const vidDiv = document.getElementById('centerDiv')
		vidDiv.appendChild(canvas)
		const labeledFaceDescriptors = await loadLabeledImages()
		const displaySize = { width: video.width, height: video.height}
		const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
		faceapi.matchDimensions(canvas, displaySize)
		setInterval(async () => {
			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
			console.log(detections);
			const resizedDetections = faceapi.resizeResults(detections, displaySize)
			const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
			results.forEach((result, i) => {
				console.log(result);
				const box = resizedDetections[i].detection.box
				const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
				drawBox.draw(canvas)
			})
			// canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
			// faceapi.draw.drawDetections(canvas, resizedDetections)
		}, 100)
	})

	//identification
	const loadLabeledImages = () => {
		const labels =['Bobby']
		return Promise.all(
			labels.map(async label => {
				for (let i =1; i <=2; ) {
					const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/robaboyd/ghost/master/public/people/${labels}/${i}.jpg`)
					const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
					descriptions.push(detections.descriptor)
				}

				return new faceapi.LabeledFaceDescriptors(label, descriptions)
			})
		)
	}	
	//-------------------------------------------------------------------------------

	// let g = document.createElement('h2')
	// const ghostResponse = document.querySelector('.ghost');
	// ghostResponse.appendChild(g)
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

		//commands
		if(transcript === 'omega') {
			if(e.results[0].isFinal){
				response('yes, what do you need', 1.5)
				$('.wrapper').addClass('listening');
				 listening = true;
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
						lightControl(true, transcript, "on");
						
						}
					}
					//Hue Lights OFF
					if(transcript.includes('turn off the')){
						if(e.results[0].isFinal){
							lightControl(false, transcript, "off");
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

	const lightControl = (state, transcript, command) => {
		$.get(`https://discovery.meethue.com/`, (data) => {
			let ip = data[0].internalipaddress;
			let url = `http://${ip}/api/pf3enyrZJz4uvwgYf90t9E2FzLM4tW2GeGSnO-ut/lights` 
			$.get(url, done => {
				let lightname = transcript.split(`${command} the`)
				lightname = lightname[1]
				let array = []
								
				for(let i = 1; i <= Object.keys(done).length; i++){
					array.push({"name": done[i].name, "index": i})
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
				var fuse = new Fuse(array, options)
				var result = fuse.search(lightname.trim())
				let data = {on: state}
				$.ajax({
					url: `${url}/${result[0].index}/state`,
					type: 'PUT',
					data: JSON.stringify(data), 
					success: function() {
						response('yes, doing that now', 1.0)
						
					}
				});
									
					})
				})
				$('.wrapper').removeClass('listening')
				listening = false
	}

	recognition.addEventListener('end', recognition.start)
	recognition.start();
