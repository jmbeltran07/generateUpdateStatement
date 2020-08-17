const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { generateUpdateStatement } = require('./generateUpdateStatement')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// This is a simple server to test online, we are not validating the requests
app.post('/generateUpdateStatement', (req, res) => {
    console.log(req.body)
    const response = generateUpdateStatement(req.body.document, req.body.mutation)
    res.send(response)
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})