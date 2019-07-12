const axios = require('axios')
const Fuse = require('fuse.js')
let done = false
const lights = {
    main: (transcript, socket) => {
        //Hue Lights ON
        if(transcript.includes('turn on the')){
             lightControl(true, transcript, "on");
             let x = {finished: true, speech:`yes, doing that now.`}
             socket.emit('commandDone', x)
        }
        if(transcript.includes('turn off the')){
             lightControl(false, transcript, "off");
             
             let x = {finished: true, speech:`yes, doing that now.`}
             socket.emit('commandDone', x)
        }
        if(transcript.includes('%')){

             lightControl(false, transcript, "set")
             let x = {finished: true, speech:`yes, doing that now.`}
             socket.emit('commandDone', x)
        }
        if(transcript.includes('omega on')){

             lightControl(false, 'turn on the tv lightstrip', "omega on")
        }
        if(transcript.includes('omega off')){

             lightControl(false, 'turn on the tv lightstrip', "omega off")
        }
    }
}

const lightControl = (state, transcript, command ) => {
    return axios.get(`https://discovery.meethue.com/`).then((data) => {
        data = data.data
        let ip = data[0].internalipaddress;
        let url = `http://${ip}/api/pf3enyrZJz4uvwgYf90t9E2FzLM4tW2GeGSnO-ut/lights`
        return axios.get(url).then(lights => {
            lights = lights.data
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
                var fuse = new Fuse(array, options)
                light = fuse.search(lightFromCommand)

            }

            if(command === 'on'){

                let data = {on: state}
                axios.put(`${url}/${light[0].index}/state`, data).then(done => {
                   return {finished: true, speech:`yes, doing that now.`}
                })
            }
            if(command === 'off'){
                let data = {on: state}

                axios.put(`${url}/${light[0].index}/state`, data).then(done => {
                    return {finished: true, speech:`yes, doing that now.`}
                })
      
            }
            if(command === 'set'){
               
                let int = transcript.replace( /[^\d.]/g, '' );
                let percentage = (parseInt(int) / 100)
                let briVal = (254 * percentage)

                let data = {bri: briVal}
               let x =  axios.put(`${url}/${light[0].index}/state`, data).then(done => {
                   return{finished: true, speech:`yes, doing that now.`} 
                })

            }

            if(command === 'omega on'){

                let data = {hue: 0}
                axios.put(`${url}/${light[0].index}/state`, data).then(done => {
                })
        

            }

            if(command === 'omega off'){
                let data = {hue: 41770}

                axios.put(`${url}/${light[0].index}/state`, data).then(done => {
                })

            }

        })
    })

}
module.exports = lights;
