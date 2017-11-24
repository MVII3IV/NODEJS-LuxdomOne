var express = require('express');

var routes = function (daysModel) {
    var router = express.Router();

    router.route('/')
        .get(function (req, res) {
            daysModel.find({}, function (err, routines) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(routines);
                }
            });
        });

    return router;
}

module.exports = routes;