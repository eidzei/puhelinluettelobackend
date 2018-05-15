const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://anajuna:9dqimaF8UY!@ds119080.mlab.com:19080/ajn-puhelinluettelo'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

if(process.argv[2] === undefined){
  Person
    .find({})
    .then(result=> {
      console.log("puhelinluettelo:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}  
else {
  person
  .save()
  .then(response => {
    console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
    mongoose.connection.close()
  })
}



