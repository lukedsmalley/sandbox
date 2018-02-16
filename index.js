
const fs = require('fs-extra')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/command/load', function(req, res) {
    fs.readFile('./v/' + req.body.filename)
    .then(data => res.send(data))
    .catch(err => res.status(500).send('File not found or cannot be accessed.'))
})

app.post('/command/save', function(req, res) {
    fs.writeFile('./v/' + req.body.filename, req.body.data)
    .then(() => res.send("Success"))
    .catch(err => res.status(500).send('File not found or cannot be accessed.'))
})

app.use('/v', express.static('v'))
app.use('/edit', express.static('edit'))
app.get('/:v/', (req, res) => res.redirect('/v/' + req.params.v))
app.get('/', (req, res) => res.redirect('/edit'))

app.listen(80, () => console.log('Started.'))