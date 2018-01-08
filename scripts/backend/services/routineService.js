var routineModel = require('../models/routineModel');
var webSockets = require('../webSockets');

var get = function (req, res) {
    routineModel.find({}, function (err, routines) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(routines);
        }
    });
}

var post = function (req, res) {
    var routine = new routineModel(req.body);

    if (!routine.days || !routine.devices || !routine.timeOn || !routine.timeOff) {
        res.status(400).send('routine is incomplete');
    } else {
        routine.save(function (err) {
            if (err) {
                return 500;
            } else {
                webSockets.updateFrontEndRoutines();
                res.status(201).send(routine);
            }
        });
    }
}

var patch = function (req, res) {
    if (req.body._id)
        delete req.body._id;

    for (var p in req.body) {
        req.routine[p] = req.body[p];
    }

    req.routine.save(function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            webSockets.updateFrontEndRoutines();
            res.json(req.routine);
        }
    });
}

var remove = function (req, res) {
    req.routine.remove(function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            webSockets.updateFrontEndRoutines();
            res.status(204).send("Device has been removed");
        }
    });
}

module.exports = {
    get: get,
    post: post,
    remove: remove,
    patch: patch
}