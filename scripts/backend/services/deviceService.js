var deviceModel = require('../models/deviceModel');
var typeModel = require('../models/typesModel');
var webSockets = require('../webSockets');
var serialPort = require('../serialPort');

toggleDevice = function (device) {

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
            }

        });

    });
};

turnOnDevice = function (device) {

    device.state = true;
    device = setupDeviceCCS(device);

    //once the devicesModel has been updated, when it returns the promisse its time to update FE
    deviceModel.update(device).then(function () {
        webSockets.updateFrontEndDevices();
    });

    serialPort.sendMessageByDevice(device);
}

turnOffDevice = function (device) {
    console.log("turning off " + device.name);

    device.state = false;
    device = setupDeviceCCS(device);

    //once the devicesModel has been updated, when it returns the promisse its time to update FE
    deviceModel.update(device).then(function () {
        webSockets.updateFrontEndDevices();
    });

    serialPort.sendMessageByDevice(device);
}

setupDeviceCCS = function (device) {
    if (device.state) {
        //Turn On
        device.class = "tertiary";
        device.action = "Encendido";
    } else {
        //Turn Off
        device.class = "primary";
        device.action = "Apagado";
    }
    return device;
}

module.exports = {
    toggleDevice: toggleDevice
}