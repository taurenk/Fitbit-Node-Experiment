'use strict'

var express = require('express');
var FitbitApiClient = require("fitbit-node");
var config = require('./config/dev_config');
var jwt    = require('jsonwebtoken'); 


var app = express();
var fitbitClient = new FitbitApiClient(config.fitbitClientId, config.fitbitClientSecret);


/** Route Middleware **/

// Verify Token on Requestes
app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});


/** Routes **/
var loginApi = require('./routes/login')(app, express, fitbitClient);
app.use('/fitbit', loginApi);


app.listen(config.port, function () {
	console.log('Server started server on localhost: ' + config.port);
});
