var deviceModel = require('../models/deviceModel');
var typeModel = require('../models/typesModel');
var webSockets = require('../webSockets');
var serialPort = require('../serialPort');


var getAll = function (req, res) {
    var query = {};
    query = req.query;

    deviceModel.find(query, function (err, device) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(device);
        }
    });
}

var patch = function (req, res) {
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
}

var put = function (req, res) {

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
}

var toggleDevice = function (req, result) {
    var device = req.body;

    deviceModel.find({}, function (err, devices) {

        device.state = !device.state;
        device = setupDeviceCCS(device);
        var index = devices.findIndex(i => i._id.toString() === device._id);

        var query = {
            _id: device._id
        };

        deviceModel.update(query, device, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                devices[index] = device;
                webSockets.updateFrontEndByDevices(devices);
                serialPort.sendMessageByDevice(device);
                result.sendStatus(200);
            }

        });

    });
}

var turnOnDevice = function (device) {

    device.state = true;
    device = setupDeviceCCS(device);

    //once the devicesModel has been updated, when it returns the promisse its time to update FE
    deviceModel.update(device).then(function () {
        webSockets.updateFrontEndDevices();
    });

    serialPort.sendMessageByDevice(device);
}

var turnOffDevice = function (device) {
    console.log("turning off " + device.name);

    device.state = false;
    device = setupDeviceCCS(device);

    //once the devicesModel has been updated, when it returns the promisse its time to update FE
    deviceModel.update(device).then(function () {
        webSockets.updateFrontEndDevices();
    });

    serialPort.sendMessageByDevice(device);
}

var setupDeviceCCS = function (device) {
    if (device.state) {
        //Turn On
        device.class = "tertiary";
        device.action = "Encendido";
    } else {
        //Turn Off
        device.class = "primary";
        device.action = "En reposo";
    }
    return device;
}

//Control panel devices
var registerDevice = function (req, res) {
    var device = new deviceModel(req.body);

    if (!device.name || !device.relay || !device.xbeeId) {
        res.status(400).send('name is required');
    } else {
        device.save(function (err) {
            if (err) {
                return 500;
            } else {
                webSockets.notifyFrontEnd();
                res.status(201).send(device);
            }
        });
    }
}

var removeDevice = function (req, res) {
    req.device.remove(function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            webSockets.notifyFrontEnd();
            res.status(204).send("Device has been removed");
        }
    });

}
//End control panel devices

var updateDevicesFromDevice = function(devices, device){
    var index = devices.findIndex(obj => obj._id.toString() == device._id);
    devices[index] = device;
    return devices;
}

module.exports = {
    getAll: getAll,
    patch: patch,
    put: put,
    toggleDevice: toggleDevice,
    turnOnDevice: turnOnDevice,
    turnOffDevice: turnOffDevice,
    registerDevice: registerDevice,
    removeDevice: removeDevice,
    updateDevicesFromDevice: updateDevicesFromDevice
}