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
  /* for adding new exercises to database */
  const { _id } = req.params
  const { description, date, duration } = req.body
  const user = await User.findById(_id)
  const exercise = await Exercise.create({ description, date, duration, username: user.username })

  res.json({ username: user.username, description: exercise.description, date: exercise.date.toDateString(), duration: exercise.duration, _id })
})

app.get('/api/users/:_id/logs', async (req, res) => {
  /* to get all exercises of one user */
  const { _id } = req.params
  const { from, to, limit } = req.query
  const user = await User.findById(_id)

  let exercises = await Exercise.find({ username: user.username })
  // if (from && !to) {
  //   exercises = await Exercise.find({id: _id, date: {$gte: new Date(from)}})
  // }
  // if (!from && to) {
  //   exercises = await Exercise.find({id: _id, date: { $lte: new Date(to)}})
  // }
  if (from && to) {
    exercises = await Exercise.find({ username: user.username, date: { $gt: new Date(from), $lt: new Date(to) } })
  }

  if (limit || limit !== undefined) {
    exercises = exercises.slice(0, limit)
  }
  const count = exercises.length
  const exerciseMapped = exercises.map(exercise => {
    return { description: exercise.description, duration: exercise.duration, date: exercise.date.toDateString(), }
  })

  res.json({ username: user.username, count, _id, log: exerciseMapped })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

