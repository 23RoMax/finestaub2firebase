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


app.get('/data/latest', function (req, res) {
  let responseObject = {
    msg: null,
    status: null,
    count: 0,
    data: null
  }

  async function getMeasurement(sensor) {
    const sensorData = await db.collection(sensor)
      .orderBy('createdAt', 'desc')
      .limit(1)
    sensorData.get().then((querySnapshot) => {
        const tempDoc = []
        querySnapshot.forEach((doc) => {
            tempDoc.push({ 
              id: doc.id,
              ...doc.data()
            })
        })
        responseObject.data = tempDoc
        responseObject.count = tempDoc.length
        responseObject.status = 200
        responseObject.msg = 'Fetched latest sensor data successfully!'
        return res.status(200).send(responseObject)
     }).catch(err => {
       responseObject.msg = err
       return res.status(400).send(responseObject)
     })
  }

  const sensor = req.params.sensor || '10703075'
  getMeasurement(sensor)
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
