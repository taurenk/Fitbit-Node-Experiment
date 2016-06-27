'use strict'

module.exports = function(app, express, fitbitClient, knex) {
    var testApi = express.Router();

    testApi.get('/test', function(req, res) {
        res.json({
            testMessage: 'Test API up!'
        });
    });

    testApi.get('/testDb', function(req, res) {
        knex.select()
        	.from('fitbit_user')
        	.then(function(rows) {
                res.send(rows);
            })
    });

    testApi.get('/testRequest', function(req, res) {
        
        console.log(req.decoded);
        knex.select()
            .from('fitbit_user')
            .where('fitbit_user_id', req.decoded.fitbit_user_id)
            .then(function(rows) {       
               return fitbitClient.get('/activities/steps/date/today/1m.json', rows[0].access_token);
            })
            .then(function(result) {
                res.send(result);
            })
            .catch(function(error) {
                console.log('error: ' + error);
            });
    });


    return testApi;
};