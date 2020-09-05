//////////////////////////////////////////////////
// Cloud Functions API for feinstaub sensor
// 23Ro
// C 2020
// Maximilian Nebl
//////////////////////////////////////////////////

const functions = require('firebase-functions')
const firebase = require('firebase')
const admin = require('firebase-admin')
require("firebase/firestore")
const express = require('express')
const cors = require('cors')

const app = express()
admin.initializeApp()
const db = admin.firestore()

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

app.post('/data', async function (req, res) {
  let responseObject = {
    msg: null,
    status: null,
    count: 0,
    data: null
  }
  
  async function addMeasurement (sensor, sensorData) {
    db.collection(sensor).add(sensorData)
    .then(docRef => {
      console.log('Storing sensor data of', sensor)
      console.log(sensorData)
      console.log("Document written with ID: ", docRef.id)
      responseObject.status = 200
      responseObject.count = 1
      responseObject.msg = 'Created Sensordata successfully'
      responseObject.data = sensorData
      return res.status(200).send(responseObject)
    })
    .catch(error => {
      console.error("Error adding document: ", error)
      responseObject.msg = error
      responseObject.status = 400
    })
  }

  try {

    const sensor = req.body.esp8266id

    let now = new Date().toISOString()


    var sensorData = {
      createdAt: now,
      updatedAt: now,
      ...req.body.sensordatavalues
    }

    await addMeasurement(sensor, sensorData)

  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})
const api = functions.https.onRequest(app)

module.exports = {
  api
}
