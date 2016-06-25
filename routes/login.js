'use strict'

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function(app, express, fitbitClient) {
    
    var loginApi = express.Router();

	loginApi.get('/authorize', function (req, res) {
	    res.redirect(fitbitClient.getAuthorizeUrl(
	    	'activity heartrate location nutrition profile settings sleep social weight', 
	    	'http://127.0.0.1:3000/fitbit/token')
	    );
	});


	loginApi.get('/token', function (req, res) {
	
		fitbitClient.getAccessToken(req.query.code, 'http://127.0.0.1:3000/fitbit/token')
			.then(function (result) {
		    	return fitbitClient.get('/profile.json', result.access_token);
		    })
		    .then(function (results) {

		    	var token = jwt.sign('data', 'superSecret');
		    	// TODO; Upsert user record in database.

		    	//res.send(results);
		    	res.json({
		        	success: true,
		        	message: 'Logged into Node-Fitbit-Experiment.',
		        	token: token
		        });
		    })
		    .catch(function (error) {
		    	console.log('error:' + error);
		        res.send(error);
		    });
	    
	});

    return loginApi;
};