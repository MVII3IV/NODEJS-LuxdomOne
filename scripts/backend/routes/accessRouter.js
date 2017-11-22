var express = require('express');
var accessService = require('../services/accessService');




var routes = function () {
    var router = express.Router();

    router.route('/activate')
        .post(accessService.activate);

    return router;
}

module.exports = routes;