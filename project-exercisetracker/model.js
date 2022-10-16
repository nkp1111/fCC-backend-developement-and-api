const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  description: {
    type: String
  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
    default: new Date()
  }
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = { User, Exercise }
