const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URL //eslint-disable-line


mongoose.connect(url)
  .then(res => { //eslint-disable-line
    console.log('conected to MongoDB')
  })
  .catch(err => {
    console.log('problem with conection', err.message)
  })

// PERSON SCHEMA
const myPerson = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    unique: true
  }
})

myPerson.plugin(uniqueValidator)

// FORMATING THE SCHEMA
myPerson.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// EXPORL MODEL
module.exports = mongoose.model('Person', myPerson)