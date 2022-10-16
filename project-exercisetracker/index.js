const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

/* to start mongoose */
const mongoose = require('mongoose')
const mySecret = process.env['MONGO_URI']
mongoose.connect(mySecret).then(() => {
  console.log('Mongoose connected')
})

const { User, Exercise } = require('./model.js')

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extendend: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  /* for adding new user to database */
  const { username } = req.body
  const user = await User.create({ username })
  res.json({ username: user.username, _id: user._id })
})

app.get('/api/users', async (req, res) => {
  /* to get the list of all users */
  const users = await User.find({})
  const newUser = users.map(user => {
    return { _id: user._id, username: user.username }
  })
  res.send(newUser)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params
  const { description, date, duration } = req.body
  const exercise = await Exercise.create({ description, date, duration, id: _id })
  const user = await User.findById(_id)

  res.json({ username: user.username, description: exercise.description, date: exercise.date.toDateString(), duration: exercise.duration, _id: _id })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
