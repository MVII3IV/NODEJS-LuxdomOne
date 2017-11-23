var webSockets = require('../webSockets');
var serialPort = require('../serialPort');
var deviceModel = require('../models/deviceModel');
var deviceService = require('../services/deviceService');

var accessWanted;
var timeOutToRestartAccess = 5000;
var accessTimeout = {};

var activate = function (req, res) {

    var device = req.body;

    deviceModel.find({}, function (err, devices) {
        if (err) {
            res.send(err);
        } else {

            if (!accessWanted || accessWanted._id != device._id) {

                clearTimeout(accessTimeout);
                accessWanted = device;
                changeAccessStateAndNotifyFrontEnd(true, devices, device);

                accessTimeout = setTimeout(function () {
                    accessWanted = null;
                    changeAccessStateAndNotifyFrontEnd(false, devices, device);                
                    webSockets.updateFrontEndByDevices(devices);
                }, timeOutToRestartAccess);

                return res.send('Confirm action');
            }

            if (accessWanted) {
                changeAccessStateAndNotifyFrontEnd(false, devices, device);
                serialPort.sendMessageByDevice(device);
                accessWanted = null;
                return res.send('ok');
            }
        }

    });
}

function changeAccessStateAndNotifyFrontEnd(state, devices, device){
    device.state = state;
    changeAccessCSS(device)
    devices = deviceService.updateDevicesFromDevice(devices, device);
    webSockets.updateFrontEndByDevices(devices);
}

var changeAccessCSS = function (device) {
    if (device.state) {
        //Confirmation
        device.class = "warning";
        device.action = "Confirmar";
    } else {
        //default
        device.class = "primary";
        device.action = "En reposo";
    }

    return device;
}

module.exports = {
    activate: activate
}