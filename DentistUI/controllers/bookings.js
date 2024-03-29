"use strict";

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const mqttClient = require('../mqtt/mqtthandler');

// Dentist cannot mark a booking as 'cancelled'. The patient can only cancel a booking.
const STATES = ['confirmed', 'rejected', 'completed'];

// Map to store the resolvers for each request
const resolvers = new Map();

// 'message' event listener when the script starts running.
// Instead of creating a new listener for each request.
// To prevent memory leaks 
// (MaxListenersExceededWarning: Possible EventEmitter memory leak.).
mqttClient.on('message', (topic, message) => {
    const resolve = resolvers.get(topic);
    if (resolve) {
        resolve(message.toString());
        resolvers.delete(topic);
    }
});

router.patch('/:bookingId', async (req, res) => {

    if (!req.params.bookingId || !req.body.state) {
        return res.status(400).send('missing parameters');
    }

    if (isNaN(req.params.bookingId)) {
        return res.status(400).send('invalid parameters: bookingId should be a number');
    }

    if (!STATES.includes(req.body.state.toLowerCase())) {
        return res.status(400).send('invalid parameters: state should be one of: ' + STATES.join(', ') + ')');
    }

    const topic = 'toothtrek/booking/state';
    const responseTopic = topic + '/' + uuidv4();

    var booking = {
        bookingId: req.params.bookingId,
        state: req.body.state.toLowerCase(),
        responseTopic: responseTopic
    };

    try {

        mqttClient.subscribe(responseTopic);
        mqttClient.publish(topic, JSON.stringify(booking));

        // Create a new Promise for the request
        const response = await new Promise((resolve, reject) => {
            // Store the resolver in the map
            resolvers.set(responseTopic, resolve);

            // Set a timeout for the response
            const timeout = setTimeout(() => {
                mqttClient.unsubscribe(responseTopic);
                resolvers.delete(responseTopic);
                reject(new Error('Request timed out'));
            }, 15000);
        });

        mqttClient.unsubscribe(responseTopic);

        // Handle the response from the broker
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.status === 'success') {
            return res.status(200).send(parsedResponse);
        }
        else {
            return res.status(400).send(parsedResponse);
        }

    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;