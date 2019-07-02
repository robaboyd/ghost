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

io.on('connection', (socket) => {

  socket.on('test', () => {
    console.log('testing');
  })
  socket.on('getname', () => {
    console.log('getname');
    //read from data.txt
    let data = fs.readFileSync(__dirname + '/data.json')
    let names = JSON.parse(data)
    
    if(names.people.length > 1){
      console.log(names.people.length);
     names.people.splice((names.people.length - 1), 0, 'and')
      console.log(names.people.toString()); 

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
exec("start cmd.exe cd C:/Users/Bobby/Documents/Github/ghost /K python fr.py")

server.listen(PORT, () => {
  console.log(`Listening on PORT:  ${PORT}`);
});