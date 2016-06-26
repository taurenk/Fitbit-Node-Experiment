'use strict'

var express = require('express');
var FitbitApiClient = require("fitbit-node");
var config = require('./config/dev_config');
var jwt    = require('jsonwebtoken'); 


var app = express();
var fitbitClient = new FitbitApiClient(config.fitbitClientId, config.fitbitClientSecret);



/** Routes **/
var loginApi = require('./routes/login')(app, express, fitbitClient);
app.use('/fitbit', loginApi);


/** Route Middleware **/
app.use(function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {
        // if there is no token, return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
      }
});


var testApi = require('./routes/test')(app, express);
app.use('/test', testApi);

app.listen(config.port, function () {
	console.log('Server started server on localhost: ' + config.port);
});
