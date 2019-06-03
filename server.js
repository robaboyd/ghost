const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path')
const axios = require('axios')

//axios calls


app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/public/index.html'));
});
app.listen(PORT, ()=> {
	console.log(`listening on ${PORT}`);
})