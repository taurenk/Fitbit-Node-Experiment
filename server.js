'use strict'

var express = require('express');
var FitbitApiClient = require("fitbit-node");
var config = require('./config/dev_config');

var app = express();
var fitbitClient = new FitbitApiClient(config.fitbitClientId, config.fitbitClientSecret);


/** Routes **/
var testApi = require('./routes/test')(app, express);
app.use('/api', testApi);

var loginApi = require('./routes/login')(app, express);
app.use('/fitbit', loginApi);



app.listen(config.port, function () {
	console.log('Server started server on localhost: ' + config.port);
});
