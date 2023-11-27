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
app.get('/api/persons/', (request, response, next) => {

  Person.find({}).then(res => {
    response.json(res)
  })
  .catch(err => next(err))
})


// GET DIRECTORY INFO
app.get('/info/', async (resquest, response) => {

  const personsData = await Person.find({})  
  const currentDate = new Date()

  response.send(`
        <h3> Phonebook has info for ${personsData.length} people </h3>
        <h3> ${currentDate} </h3>
    `)
})


// GET PERSON BY ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  
  Person.findById(id)
    .then(res => {
      response.json(res)
    })
    .catch(err => next(err))
}) 


// DELETE PERSON BY ID
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(res => {
      console.log(res)
      response.status(204).end()
    })
    .catch(err => next(err))
})


// ADD A NEW PERSON
app.post('/api/persons/', async (request, response, next) => {

  const { name, number } = request.body

  if (!name || !number) {
    next(error.name = 'CastError')
  }


  const addPerson = new Person({ name, number })

  addPerson.save()
    .then(res => {
      console.log('Person added with succes')
      response.json(addPerson)
    })
    .catch(err => next(err))
})


// EDIT USER
app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true
  })
    .then(res => {
      console.log('Person edited with success')
      response.json(res)
    })
    .catch(err => next(err))
})


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformated id' })
  }
  else if(error.name === 'ValidationError'){
    const myError = error
    
    response.status(400).send({error: myError})
  }

  next(error)
}


app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// CONFIGURATION
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
})