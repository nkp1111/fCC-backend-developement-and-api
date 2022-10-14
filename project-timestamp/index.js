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

const isDateValid = (givenDate) => {
  // to check whether a date is valid
  const [year, month, date] = givenDate.split('-').map(d => +d)
  const monthWith30Days = [4, 6, 9, 11]
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

const format = (num) => {
  return num < 10 ? '0' + num : num
}

const toUTCFormat = (givenDate) => {
  // to convert date in format: Thu, 01 Jan 1970 00:00:00 GMT
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const day = days[givenDate.getDay()]
  const date = format(givenDate.getDate())
  const year = givenDate.getFullYear()
  const month = months[givenDate.getMonth() - 1]
  console.log(givenDate, `${day}, ${date} ${month} ${year} 00:00:00 GMT`);
  return `${day}, ${date} ${month} ${year} 00:00:00 GMT`
}

const dateOp = (date, res) => {
  // if date id present
  const validity = isDateValid(date)
  let newDate = new Date(date)
  let utcDate
  if (validity) {
    unixTime = newDate.getTime()
    utcDate = toUTCFormat(newDate)
    res.json({ "unix": unixTime, "utc": utcDate })
  } else {
    res.json({ "error": "Invalid Date" })
  }
}

const noDateOp = (res) => {
  // if date is not present
  let newDate = new Date()
}

// date to timestamp 
app.get("/api/:date", (req, res) => {
  const { date } = req.params
  if (date) {
    dateOp(date, res)
  } else {
    noDateOp(res)
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
