var express = require('express');
var deviceService = require('../services/deviceService');

var routes = function (Device) {

    var deviceRouter = express.Router();

    deviceRouter.route('/toggle')
        .post(function (req, res) {
            var device = req.body;
            deviceService.toggleDevice(device);
            res.sendStatus(200);
        });





    deviceRouter.route('/')
        .get(
            function (req, res) {
                var query = {};
                query = req.query;

                Device.find(query, function (err, device) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(device);
                    }

                });
            }
        )
        .post(
            function (req, res) {
                var device = new Device(req.body);

                if (!req.body.name || !req.body.relay || !req.body.xbeeId) {
                    res.status(400);
                    res.send('name is required');
                } else {
                    deviceService.registerNewDevice(device);
                    res.status(201);
                    res.send(device);
                }
            }
        );

    deviceRouter.use('/:deviceId', function (req, res, next) {
        Device.findById(req.params.deviceId, function (err, device) {
            if (err) {
                res.status(500).send(err);
            } else if (device) {
                req.device = device;
                next();
            } else {
                res.status(404).send("no device found");
            }
        });
    });

    //find by id
    deviceRouter.route('/:deviceId')
        .get(function (req, res) {

            var returnDevice = req.device.toJSON();

            returnDevice.links = {};
            returnDevice.links.filterByXbeeId = 'http://' + req.headers.host + '/api/devices/?xbeeId=' + returnDevice.xbeeId;
            returnDevice.links.flterByType = 'http://' + req.headers.host + '/api/devices/?type=' + returnDevice.type;

            res.json(returnDevice);
        })
        .put(function (req, res) {

            req.device.name = req.body.name;
            req.device.relay = req.body.relay;
            req.device.action = req.body.action;
            req.device.class = req.body.class;
            req.device.state = req.body.state;
            req.device.xbeeId = req.body.xbeeId;
            req.device.type = req.body.type;
            req.device.watts = req.body.watts;

            req.device.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.device);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.device[p] = req.body[p];
            }

            req.device.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.device);
                }
            });
        })
        .delete(function (req, res) {
            req.device.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(204).send("Device has been removed");
            });
        });

    return deviceRouter;
};

module.exports = routes;