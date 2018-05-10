const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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
  res.json(persons)
})

app.get('/info', (req, res) => {
    const length = persons.length
    let time = new Date()
    res.send(
        `<div>
            <p>puhelinluettelossa ${length} henkilön tiedot</p>
            ${time}
        </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
  
    if ( person ) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    //const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 0
    return Math.floor(Math.random() * 10000)
}

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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})