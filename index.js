// MODULE IMPORTS
const express = require('express')
const morgan = require('morgan')
const env = require('dotenv')
const Person = require('./models/person')

const app = express()
env.config()

// MIDDLEWARES
app.use(express.json())
app.use(express.static('build'))

app.use(morgan(function (tokens, req, res) {
    const body = req.body

    const object = {
        name: body.name,
        number: body.number
    }

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(object)
    ].join(' ')
  }))


// GET ALL DIRECTORY PERSONS
app.get('/api/persons/', (request, response) => {
    Person.find({}).then(res =>{
        response.json(res)
    })
})


// GET DIRECTORY INFO
app.get('/info/', (resquest, response) => {

    const personsCount = persons.length
    const currentDate = new Date()

    response.send(`
        <h3> Phonebook has info for ${personsCount} people </h3>
        <h3> ${currentDate} </h3>
    `)
})


// GET PERSON BY ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const myPerson = persons.find(person => person.id === id)

    if (myPerson) {
        response.json(myPerson)
    }
    else {
        response.status(404).end()
    }
})


// DELETE PERSON BY ID
app.delete('/api/persons/delete/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person !== id)

    response.status(204).end()
})


// ADD A NEW PERSON
app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const addPerson = new Person({
        name: body.name,
        number: body.number
    })

    addPerson.save()
        .then(res =>{
        console.log('Person added with succes')
        response.json(addPerson)
    })
})


// CONFIGURATION
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})