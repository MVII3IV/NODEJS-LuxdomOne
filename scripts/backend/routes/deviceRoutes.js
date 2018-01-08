var express = require('express');
var deviceService = require('../services/deviceService');

var routes = function (Device) {
    var deviceRouter = express.Router();

    deviceRouter.route('/')
        .get(deviceService.get)
        .post(deviceService.post);

    deviceRouter.route('/toggle')
        .post(deviceService.toggleDevice);

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

    deviceRouter.route('/:deviceId')
        .get(function (req, res) {

            var returnDevice = req.device.toJSON();

            returnDevice.links = {};
            returnDevice.links.filterByXbeeId = 'http://' + req.headers.host + '/api/devices/?xbeeId=' + returnDevice.xbeeId;
            returnDevice.links.flterByType = 'http://' + req.headers.host + '/api/devices/?type=' + returnDevice.type;

            res.json(returnDevice);
        })
        .put(deviceService.put)
        .patch(deviceService.patch)
        .delete(deviceService.removeDevice);

    return deviceRouter;
};

module.exports = routes;