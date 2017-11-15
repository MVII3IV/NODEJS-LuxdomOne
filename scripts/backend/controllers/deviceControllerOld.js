var serialPort = require('../serialPort.js');
var deviceModel = require('../models/device.js');
var webSockets = require('../webSockets.js');
var energyProfiler = require('../energyProfiler.js');

var toggleDevice = function (device) {

  deviceModel.findAll().then(function (devices) {

    device.state = !device.state;

    device = setupDeviceCCS(device);

    var index = devices.findIndex(i => i.id === device.id);

    deviceModel.update(device);
    devices[index] = device;

    webSockets.updateFrontEndByDevices(devices);

    serialPort.sendMessageByDevice(device);
  });

};

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
    device.action = "Apagado";
  }
  return device;
}
module.exports = {
  toggleDevice: toggleDevice,
  turnOnDevice: turnOnDevice,
  turnOffDevice: turnOffDevice
}