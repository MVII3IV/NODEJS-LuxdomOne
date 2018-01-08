var express = require('express');

var routes = function (routineModel, routineService) {
    var router = express.Router();

    router.route('/')
        .get(routineService.get)
        .post(routineService.post);


        router.use('/:routineId', function (req, res, next) {
            routineModel.findById(req.params.routineId, function (err, routine) {
            if (err) {
                res.status(500).send(err);
            } else if (routine) {
                req.routine = routine;
                next();
            } else {
                res.status(404).send("no device found");
            }
        });
    });

    router.route('/:routineId')
        .get(function (req, res) {
            var returnRoutine = req.device.toJSON();
            res.json(returnRoutine);
        })
        .patch(routineService.patch)
        .delete(routineService.remove);

    return router;
}

module.exports = routes;