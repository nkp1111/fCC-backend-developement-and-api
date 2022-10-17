var express = require('express');
var cors = require('cors');
require('dotenv').config()
const fs = require('fs')
const fileUpload = require('express-fileupload')

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
  const { upfile } = req.files
  const name = upfile.name
  const type = upfile.mimetype
  const size = upfile.size
  console.log(name, type, size)
  res.json({ name, type, size })
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
