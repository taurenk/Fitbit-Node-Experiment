

'use strict'

module.exports = function(app, express, fitbitClient) {
    
    var loginApi = express.Router();

	loginApi.get('/authorize', function (req, res) {
	    res.redirect(fitbitClient.getAuthorizeUrl(
	    	'activity heartrate location nutrition profile settings sleep social weight', 
	    	'http://127.0.0.1:3000/fitbit/token')
	    );
	});

	loginApi.get('/token', function (req, res) {
	fitbitClient.getAccessToken(req.query.code, 'http://127.0.0.1:3000/fitbit/token').then(function (result) {
        fitbitClient.get("/profile.json", result.access_token).then(function (results) {
            res.send(results);
        });
    }).catch(function (error) {
        res.send(error);
    });
    
});

    return loginApi;
};