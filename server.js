'use strict'

var express = require('express');
var FitbitApiClient = require("fitbit-node");
var config = require('./config');

var app = express();


var testApi = require('./routes/test')(app, express);
app.use('/api', testApi);

/** Fitbit Oauth **/
var fitbitClient = new FitbitApiClient(config.fitbitClientId, config.fitbitClientSecret);

app.get('/fitbit/authorize', function (req, res) {
    res.redirect(fitbitClient.getAuthorizeUrl(
    	'activity heartrate location nutrition profile settings sleep social weight', 
    	'http://127.0.0.1:3000/fitbit/token')
    );
});

app.get('/fitbit/token', function (req, res) {
	fitbitClient.getAccessToken(req.query.code, 'http://127.0.0.1:3000/fitbit/token').then(function (result) {
        fitbitClient.get("/profile.json", result.access_token).then(function (results) {
            res.send(results);
        });
    }).catch(function (error) {
        res.send(error);
    });
    
});




app.listen(config.port, function () {
	console.log('Server started server on localhost: ' + config.port);
});
