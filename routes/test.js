'use strict'

module.exports = function(app, express, knex) {
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

    return testApi;
};