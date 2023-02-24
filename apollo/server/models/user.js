const mongoose = require('mongoose')

// you must install this library
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  favouriteGenre: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
})

schema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret.passwordHash
    delete ret.id
    delete ret.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
