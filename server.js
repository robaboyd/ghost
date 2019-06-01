const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path')

app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
app.listen(PORT, ()=> {
	console.log(`listening on ${PORT}`);
})