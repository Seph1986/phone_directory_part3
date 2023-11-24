const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(res =>{
        console.log('conected to MongoDB')
    })
    .catch(err => {
        console.log('problem with conection', err.message)
    })

// PERSON SCHEMA
const myPerson = new mongoose.Schema({
    name: String,
    number: String
})

// FORMATING THE SCHEMA
myPerson.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// EXPORL MODEL
module.exports = mongoose.model('Person', myPerson)