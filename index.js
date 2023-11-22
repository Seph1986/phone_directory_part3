// MODULE IMPORTS
const express = require('express')
const morgan = require('morgan')
const env = require('dotenv')

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


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


// GET ALL DIRECTORY PERSONS
app.get('/api/persons/', (request, response) => {
    response.json(persons)
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
// id generator
const idGenerator = () => {
    const myNumber = Math.floor(Math.random() * 1000000000) + 1

    return myNumber
}


// controller
app.post('/api/persons/', (request, response) => {
    const body = request.body
    const checkName = persons.find(person => person.name === body.name)

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

    if(checkName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: idGenerator()
    }

    persons = persons.concat(newPerson)

    response.json(persons)
})


// CONFIGURATION
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})