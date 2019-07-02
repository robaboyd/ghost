const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path')
const axios = require('axios')
const exec = require('child_process').exec
const fs = require('fs')
//socket.io
const http = require('http');

const server = http.createServer(app);
const io = require('socket.io').listen(server);

//start py script
let child = exec("start cmd.exe cd C:/Users/Bobby/Documents/Github/ghost /K python fr.py")

io.on('connection', (socket) => {

  socket.on('getname', () => {
    //read from data.txt
    let data = fs.readFileSync(__dirname + '/data.json')
    let names = JSON.parse(data)
    
    if(names.people.length > 1){
     names.people.splice((names.people.length - 1), 0, 'and')

      io.emit('getname', names.people.toString())

    } else {
      io.emit('getname', names.people[0])
    }

  })
})
//socket
app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/public/index.html'));
});

//if unix

//if windows
//start face_rec
process.on('exit', () => {
  child.kill()
})
server.listen(PORT, () => {
  console.log(`Listening on PORT:  ${PORT}`);
});