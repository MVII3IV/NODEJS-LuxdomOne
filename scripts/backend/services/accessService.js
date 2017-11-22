var webSockets = require('../webSockets');
var serialPort = require('../serialPort');

var accessWanted;

var activate = function (req, res) {

    var device = req.body;

    if (!accessWanted || accessWanted._id != device._id) {
        accessWanted = device;
        device.state = true;
        device = changeDeviceCSS(device);
        webSockets.updateFrontEndDevices();
        return res.send('one more click');
    }

    serialPort.sendMessageByDevice(device);

    accessWanted = null;
    return res.send('ok');
}

var changeDeviceCSS = function (device) {
    if (device.state) {
        //Turn On
        //device.class = "tertiary";
        device.class = "warning";
        device.action = "Confirmar";
    } else {
        //Turn Off
        device.class = "primary";
        device.action = "Apagado";
    }
    
    return device;
}

module.exports = {
    activate : activate
}