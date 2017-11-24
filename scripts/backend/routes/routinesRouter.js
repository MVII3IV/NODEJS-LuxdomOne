var express = require('express');

var routes = function (routineModel, routineService) {
    var router = express.Router();

    router.route('/')
        .get(routineService.get)
        .post(routineService.post);

    return router;
}

module.exports = routes;