const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema(
    {
        uuid: String,
        host_email: String,
        host_id: String,
        id: String,
        topic: String,
        agenda: String,
        created_at: String,
        deleted: Boolean,
        deleted_at: String,
        deleted_by: String,
        duration: Number,
        join_url: String,
        password: String,
        start_time: String,
        start_url: String,
        timezone: String,
        type: Number,
        actual_startTime: String,
        actual_endTime: String,
        actual_duration: Number,
        alerts: [
            {
                event: String,
                event_ts: String,
                issue: Array
            }
        ],
        participants: [
            {
                join_time: String,
                user_id: String,
                user_name: String,
                id: String,
                date_time: String,
                email: String,
                registrant_id: String,
                participant_user_id: String,
                customer_key: String,
                leave_time: String,
                leave_reason: String
            }
        ],
        recording: [
            {
                share_url: String,
                total_size: Number,
                recording_count: Number,
                recording_files: [
                    {
                        recording_start: String,
                        recording_end: String,
                        file_type: String,
                        file_name: String,
                        file_size: Number,
                        file_extension: String,
                        play_url: String,
                        download_url: String,
                        status: String,
                        recording_type: String
                    }]
            }]
    })
module.exports = mongoose.model("meetingSchema", meetingSchema)