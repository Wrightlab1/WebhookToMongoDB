// Require dotenv, express, and body-parser, mongoose
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const colors = require("colors")
const connectDB = require("./config/db")
const asyncHandler = require("express-async-handler")

// Initialize express and define a port
const app = express()
const port = process.env.PORT || 4000

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

//connect to the database configured in ./config/db.js
connectDB()

//include webhooks route
app.use('/webhooks/webhooks', require("./webhooks/webhooks"))

//get route in case someone fogets to add /webhook
app.get('/', (req, res) => {
    res.status(200)
    res.send(`Webhook Sample Node.js successfully running. Set this URL with the /webhooks/webhooks path as your apps Event notification endpoint URL. https://github.com/zoom/webhook-sample-node.js`)
})

// Start express on the defined port
app.listen(port, () => console.log(`🚀 Server running on port ${port}`))



