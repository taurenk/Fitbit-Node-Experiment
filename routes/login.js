'use strict'

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function(app, express, fitbitClient, knex) {
    
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

				//return fitbitClient.get('/profile.json', result.access_token);
				knex.select()
        			.from('fitbit_user')
		    		.where('fitbit_user_id', result.user_id)
		    		.catch(function(error) {
		    			console.log('Error trying to find user in database.');
		    			res.status(400).send('Error Logging In');
		    		})
		    		.then(function(rows) {
		    			if (rows.length == 0) {
		    				console.log('Insert USER');
		    				knex('fitbit_user')
		    					.insert({
		    						fitbit_user_id: result.user_id,
		    						access_token: result.access_token,
		    						refresh_token: result.refresh_token
		    					})
		    					.then(function() {
		    						return result.user_id;
		    					})
		    					.catch(function(error) {
		    						 res.status(400).send('Error creating user');
		    					});
		    			} else if (rows.length == 1) {
		    				console.log('Update USER');
		    				knex('fitbit_user')
								.where('fitbit_user_id', result.user_id)
								.update({
									access_token: result.access_token,
									refresh_token: result.refresh_token
								})
								.then(function(response) {
									return result.user_id;
								})
								.catch(function(error) {
									res.status(400).send('Error updating user');
								});
		    			}
		    		});

		    })

		    .then(function (results) {

		    	var token = jwt.sign(results, 'superSecret');
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