"use strict";

const express = require('express');
const morgan = require('morgan');

// Controllers
const timeslotsController = require('./controllers/timeslots');
const recordsController = require('./controllers/records');
const bookingsController = require('./controllers/bookings');
const officesController = require('./controllers/offices');
const dentistsController = require('./controllers/dentists');

const app = express();
const port = process.env.PORT || 3000;

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));

// Controllers usage
app.use('/api/timeslots', timeslotsController);
app.use('/api/records', recordsController);
app.use('/api/bookings', bookingsController);
app.use('/api/offices', officesController);
app.use('/api/dentists', dentistsController);

app.get('/api', function (req, res) {
    res.json({ 'message': 'Message from the DentistUI!' });
});

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
