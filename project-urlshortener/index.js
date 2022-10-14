require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validator = require('validator')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }))

const urls = []

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body
  if (validator.isURL(url)) {
    urls.push(url)
    let short_url = urls.indexOf(url)
    res.json({ original_url: url, short_url })
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params
  const url = urls[short_url]
  res.redirect(url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
