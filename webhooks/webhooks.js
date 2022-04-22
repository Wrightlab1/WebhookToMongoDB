var express = require('express')
var router = express.Router()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")
const meetingSchema = require('../schemas/meetings.js')
const controllers = require("../controllers/meetingsController")
let db = mongoose.connection;

//define the webhooks route
//post route to receive webhooks
router.post("/", asyncHandler(async (req, res) => {
    //check to see if authcode is correct if yes action the event if no descard the event
    if (req.headers.authorization === process.env.ZOOM_WEBHOOK_VERIFICATION_TOKEN) {
        var response = { "message": "'Authorized request to Webhook Sample Node.js.'".cyan, status: 200 }
        console.log(response.message)
        console.log(` Recieved POST request with Event Type: ${req.body.event}`.green.underline)
        //filter by req.body.event and call appropriate function from ../controllers/meetingsController
        if (req.body.event == "meeting.created") {
            controllers.meetingCreated(req)
        } else if (req.body.event == "meeting.deleted") {
            controllers.meetingDeleted(req)
        } else if (req.body.event == "meeting.participant_joined") {
            controllers.participantJoined(req)
        } else if (req.body.event == "meeting.participant_left") {
            controllers.participantLeft(req)
        } else if (req.body.event == "meeting.started") {
            controllers.meetingStarted(req)
        } else if (req.body.event == "meeting.ended") {
            controllers.meetingEnded(req)
        } else if (req.body.event == "recording.complete") {
            controllers.recordingComplete(req)
        } else if (req.body.event == "meeting.alert") {
            controllers.meetingAlerted(req)
        } else {
            console.log(`ERROR : ${req.body.event} not caught`.red.bgwhite)
        }
        //respond to the request with 200
        res.status(response.status)
        res.json(response)
    } else {
        var response = { "message": "'Unauthorized request to Webhook Sample Node.js.'".orange.underline, status: 401 }
        console.log(response.message)
        console.log(req.body.event)
        res.status(response.status)
        res.json(response)

    }

}))

//export router
module.exports = router;