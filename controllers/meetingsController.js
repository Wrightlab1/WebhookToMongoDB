const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")
const meetingSchema = require('../schemas/meetings.js')
let db = mongoose.connection;


//Meeting Created
const meetingCreated = asyncHandler(async (req) => {
    console.log(``)
    try {
        //create model instance
        const meeting = new meetingSchema({
            uuid: req.body.payload.object.uuid,
            id: req.body.payload.object.id,
            host_id: req.body.payload.object.host_id,
            host_email: req.body.payload.operator,
            topic: req.body.payload.object.topic,
            type: req.body.payload.object.type,
            start_time: req.body.payload.object.start_time,
            duration: req.body.payload.object.duration,
            timezone: req.body.payload.object.timezone,
            join_url: req.body.payload.object.join_url,
            password: req.body.payload.object.password,
            created_at: req.body.event_ts,
            deleted: false,
            deleted_at: "undefined",
            deleted_by: "undefined",
            actual_startTime: "undefined",
            actual_endTime: "undefined"
        })
        //save model instance
        meeting.save(function (err) {
            if (err) console.log(err);
            console.log(`UserID: ${req.body.payload.object.host_id} Created MeetingID ${req.body.payload.object.uuid} it has been added to db`.green.underline)
        });

    } catch (error) {
        console.log(`MeetingID ${req.body.payload.object.uuid} not added to db`.red.bgWhite)
    }
})

//Meeting Deleted
const meetingDeleted = asyncHandler(async (req) => {
    try {
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid })
        //update the doc
        doc.deleted = true
        doc.deleted_at = req.body.event_ts
        doc.deleted_by = req.body.payload.operator_id
        //save the doc
        await doc.save();
        console.log(`OperatorID: ${req.body.payload.operator_id} has deleted MeetingID ${req.body.payload.object.uuid} the db has been updated`.red.underline)
    } catch (error) {
        const message = `meetingid: ${req.body.payload.object.uuid} not found in db`.red.bgWhite
        console.log(`Error: ${message}`)
        console.log(error)
    }
})

//Meeting Started
const meetingStarted = asyncHandler(async (req) => {
    try {
        console.log(`Meeting: ${req.body.payload.object.uuid} has Started`.yellow.underline)
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid })
        //update the doc
        doc.actual_startTime = req.body.payload.object.start_time
        //save the doc
        await doc.save();
        console.log(`MeetingID ${req.body.payload.object.uuid} has been Started`)
    } catch (error) {
        console.log(`meetingid: ${req.body.payload.object.uuid} not found in db. Could not update meeting`.red.bgWhite)
    }
})
//Meeting Ended
const meetingEnded = asyncHandler(async (req) => {
    try {
        console.log(`Meeting: ${req.body.payload.object.uuid} has Ended`.yellow.underline)
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid })
        //update the doc
        doc.actual_endTime = req.body.payload.object.end_time
        //save the doc
        await doc.save();
        console.log(`MeetingID ${req.body.payload.object.uuid} has been Ended`)
    } catch (error) {
        const message = `ERROR: meetingid: ${req.body.payload.object.uuid} not found in db. Could not update meeting`.red.bgWhite
        console.log(`Error: ${message}`)
    }
})
//Participant Joined
const participantJoined = asyncHandler(async (req) => {
    try {

        await meetingSchema.findOneAndUpdate(
            { uuid: req.body.payload.object.uuid },
            {
                $push: {
                    participant: {
                        join_time: req.body.payload.object.participant.join_time,
                        user_id: req.body.payload.object.participant.user_id,
                        id: req.body.payload.object.participant.id,
                        email: req.body.payload.object.participant.email,
                        registrant_id: req.body.payload.object.participant.registrant_id,
                        participant_user_id: req.body.payload.object.participant.participant_user_id,
                        customer_key: req.body.payload.object.participant.customer_key
                    }
                }
            },
            { new: true, upsert: true })


    } catch (error) {
        const message = `meetingid: ${req.body.payload.object.uuid} not found in db. Could not add participant: ${req.body.payload.object.participant.id}`.red.bgWhite
        console.log(`Error: ${message}`)
        console.log(error)
    }
})
//Participant Left
const participantLeft = asyncHandler(async (req) => {
    try {
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid, participants: { id: req.body.payload.object.participant.id } })
        //update the doc
        doc.participant.leave_time = req.body.payload.object.participant.leave_time
        doc.participant.leave_reason = req.body.payload.object.participant.leave_reason
        //save to doc
        await doc.save()
    } catch (error) {
        const message = `meetingid: ${req.body.payload.object.uuid} not found in db. Could not update participant: ${req.body.payload.object.participant.id}`.red.bgWhite
        console.log(`Error: ${message}`)
        console.log(error)
    }
})
//Meeting Alert
const meetingAlerted = asyncHandler(async (req) => {
    try {
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid })
        //update the doc
        let alert = {}
        await doc.save(alert)
    } catch (error) {
        const message = "Meeting Alert Not Updated"
        console.log(`Error: ${message}`)
    }
})

//Recording Complete
const recordingComplete = asyncHandler(async (req) => {
    try {
        //load the doc
        let doc = await meetingSchema.findOne({ uuid: req.body.payload.object.uuid })
        //update the doc
        let recording = {}
        await doc.save(recording)
    } catch (error) {
        const message = "Meeting Not Updated"
        console.log(`Error: ${message}`)
    }
})

module.exports = { meetingCreated, meetingDeleted, meetingStarted, meetingEnded, participantJoined, participantLeft, meetingAlerted, recordingComplete }
