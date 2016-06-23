'use strict'

module.exports = function(app, express) {
    var testApi = express.Router();

    testApi.get('/test', function(req, res) {
        res.json({
            testMessage: 'Test API up!'
        });
    });
    return testApi;
};