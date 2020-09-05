//////////////////////////////////////////////////
// Cloud Functions API for feinstaub sensor
// 23Ro
// C 2020
// Maximilian Nebl
//////////////////////////////////////////////////

const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
/* eslint-disable*/
app.get('/', function (req, res) {
  let welcome = {
    msg: "Welcome to the feinstaub cloud function api.",
    routes: {
      auth: [],
      systems: []
    }
  }

  res.send(welcome);
});


app.get('/data', function (req, res) {
  console.log(JSON.stringify(response))
  return res.status(200).send("Hi")
})

app.post('/data', function (req, res) {
  console.log(req.body)
  return res.status(200).send("Hi")
})
const api = functions.https.onRequest(app)

module.exports = {
  api
}
