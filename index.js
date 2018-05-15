const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

app.use(bodyParser.json())

morgan.token('body', function(req, res){ return JSON.stringify(req.body) })

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1,
      
    },
    {
      name: "Martti Tienari",
      number: "040-123456",
      id: 2,
      
    },
    {
      name: "Arto Järvinen",
      number: "040-123456",
      id: 3,
      
    },
    {
      name: "Lea Kutvonen",
      number: "040-123456",     
      id: 4  
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
})

const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
  }

const length = app.get('/api/persons', (req,res)=> {
    Person
        .find({})
        .then(function(result) {
            console.log(result)
            res.json(result.reduce((acc, cur) => acc + 1, 0))
        })
})

app.get('/info', (req, res) => {
    let time = new Date()
    res.send(
        `<div>
            <p>puhelinluettelossa ${length} henkilön tiedot</p>
            ${time}
        </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    } 
    if (body.number === undefined) {
      return response.status(400).json({error: 'number missing'})
    }
    if (persons.map(p => p.name).includes(body.name)) {
      return response.status(400).json({error: 'name must be unique'})  
    } 

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(formatPerson)
        .then(savedAndFormattedPerson =>{
            response.json(savedAndFormattedPerson)
        })
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    console.log(body)

    const person = {
        number: body.number
    }

    console.log(person)

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson =>{
            if(updatedPerson) {
                console.log(updatedPerson)
                response.json(formatPerson(updatedPerson))
            } else {
                response.status(404).end()
            }
        })
        .catch(error =>{
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})