# Zoom Webhook to MongoDB Node.js.js


This is a Node.js / Express server that receives [Zoom Platform Webhooks](https://marketplace.zoom.us/docs/api-reference/webhook-reference) and adds them to mongoDB



## Installation

In terminal, run the following command to clone the repo:

`$ git clone https://github.com/Wrightlab1/WebhookToMongoDB.git`

## Setup

1. In terminal, cd into the cloned repo:

   `$ cd webhookToMongoDB`

1. Then install the dependencies:

   `$ npm install`

1. Create an environment file to store your Video SDK Apps's Key and Secret:

   `$ touch .env`

1. Add the following code to the .env file, and insert your Webhook Verification Token found on the Features page in the Zoom App Marketplace:

   ```
   PORT=PortNumberGoesHere
   MONGODB_URI = MongoDB connection URI Goes Here
   ZOOM_WEBHOOK_VERIFICATION_TOKEN=ZOOM_WEBHOOK_VERIFICATION_TOKEN_HERE
   ```

   ![Zoom Webhook Verification Token](https://marketplace.zoom.us/docs/images/migrated/1635884356131.png "Zoom Webhook Verification Token")

1. Save and close .env.

1. Start the server:

   `$ npm run start`

1. We need to expose the local server to the internet to accept post requests, we will use [Ngrok](https://ngrok.com) (free) for this.

   Once installed, open a new terminal tab and run:
    **Note:** *ngrok port should be the same as the port congured in .env*
   `$ ngrok http {PORT}`

   > NOTE: [I've put ngrok in my PATH so I can call it globally.](https://stackoverflow.com/a/36759493/6592510)

1. Copy the ngrok https url displayed in terminal. In your apps Event notification endpoint URL input, paste your ngrok https url. Remember to include `/webhook` path.

   Example: `https://abc123.ngrok.io/webhooks/webhooks`

   ![Zoom Webhook Configuration](https://marketplace.zoom.us/docs/images/migrated/1635885688814.png "Zoom Webhook Configuration")

1. Choose the events you'd like to subscribe to.

   ![Zoom Webhook Events](https://marketplace.zoom.us/docs/images/migrated/1635884395709.png "Zoom Webhook Events")

  ### This App supports the following webhooks
   * meeting Created
   * Meeting Deleted
   * Meeting Started
   * Meeting Ended
   * Participant Joined
   * Participant Left
   * Meeting Alert
   * Recording Complete

1. Click "Save".

## Usage

1. Trigger the respective Webhook.

   For example, if you chose the [Start Meeting Webhook](https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-started), start a Zoom Meeting. You will see the Webhook headers and payload logged in terminal.

   ```js
   {
     'host': 'abc123.ngrok.io',
     'user-agent': 'Zoom Marketplace/1.0a',
     'content-length': '335',
     'authorization': '{webhook_verification_token}',
     'clientid': '{client_id}',
     'content-type': 'application/json; charset=utf-8',
     'x-forwarded-for': '{x_forwarded_for}',
     'x-forwarded-proto': 'https',
     'x-zm-trackingid': '{x_zm-trackingid}',
     'accept-encoding': 'gzip'
   }
   ```

   ```js
   {
     event: 'meeting.started',
     payload: {
       account_id: '{account_id}',
       object: {
         duration: 0,
         start_time: '2021-11-02T20:43:19Z',
         timezone: 'America/Denver',
         topic: "{topic}",
         id: '{meeting_id}',
         type: 4,
         uuid: '{meeting_uuid}',
         host_id: '{host_user_id}'
       }
     },
     event_ts: 1635885799302
   }
   ```

## Deployment

### Heroku

