// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

const isDate = (newDate) => {
  // to check whether given date, month and year is valid
  const monthWith30Days = [4, 6, 9, 11]
  const [year, month, date] = newDate.map(d => +d)
  if (year < 1800 || year > 9999 || month < 1 || month > 12 || date < 1 || date > 31) {
    return false
  }
  if (month === 2) {
    if (year % 4 !== 0 && date > 28) {
      return false
    } else if (year % 4 === 0 && date > 29) {
      return false
    }
  }
  if (monthWith30Days.includes(month) && date > 30) {
    return false
  }
  return true
}

const isDateValid = (givenDate) => {
  // to check whether a date is valid
  console.log(givenDate)
  let newDate = givenDate.split('-')
  if (newDate.length === 3) {
    return isDate(newDate) ? 'date' : false
  }
  if (newDate.length > 3) {
    return false
  }
  if (newDate.length === 1) {
    return 'timestamp'
  }
}

const format = (num) => {
  return num < 10 ? '0' + num : num
}

const toUTCFormat = (givenDate, timestamp = false) => {
  // to convert date in format: Thu, 01 Jan 1970 00:00:00 GMT
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const day = days[givenDate.getDay()]
  const date = format(givenDate.getDate())
  const year = givenDate.getFullYear()
  const month = months[givenDate.getMonth()]
  // console.log(givenDate,`${day}, ${date} ${month} ${year} 00:00:00 GMT`); 
  if (timestamp === true) {
    const hour = givenDate.getHours()
    const minute = givenDate.getMinutes()
    const second = givenDate.getSeconds()
    return `${day}, ${date} ${month} ${year} ${hour}:${minute}:${second} GMT`
  }
  return `${day}, ${date} ${month} ${year} 00:00:00 GMT`
}

const dateOp = (date, res) => {
  // if date is present
  const validity = isDateValid(date)
  let newDate = new Date(date)
  if (validity) {
    if (validity === 'timestamp' && date == +date) {
      newDate = new Date(+date)
    }
    const unixTime = newDate.getTime()
    const utcDate = toUTCFormat(newDate)
    console.log({ unix: unixTime, utc: utcDate })
    res.json({ unix: unixTime, utc: utcDate })
  } else {
    res.json({ error: "Invalid Date" })
  }
}

const noDateOp = (res) => {
  // if date is not present
  let newDate = new Date()
  const unixTime = newDate.getTime()
  const utcDate = toUTCFormat(newDate, true)
  res.json({ "unix": unixTime, "utc": utcDate })
}

// date to timestamp 
app.get("/api/:date", (req, res) => {
  const { date } = req.params
  if (date) {
    dateOp(date, res)
  }
})

app.get("/api/", (req, res) => {
  noDateOp(res)
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
