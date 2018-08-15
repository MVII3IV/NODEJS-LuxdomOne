var SerialPort = require('serialport');

var port = '/dev/ttyUSB0';

if (process.platform.includes('win'))
    port = 'COM4';

var portSerial = new SerialPort(port, {
    baudRate: 9600,
    parser: SerialPort.parsers.readline('\r\n')
});

SerialPort.list(function (err, ports) {
    console.log("Serial Devices:");
    ports.forEach(function (portSerial) {
        console.log("comName: " + portSerial.comName + ", manufacturer: " + portSerial.manufacturer);
    });
});

portSerial.on('open', function () {

});

// open errors will be emitted as an error event
portSerial.on('error', function (err) {
    console.log('Error: ', err.message);
})

portSerial.on('data', function (data) {
    console.log(data);
});

portSerial.on('disconnect', function (data) {
    console.log(data);
});

//{"deviceId":"0013A200_40EAE365","relay":1,"instruction":0}
var writeSerial = function (message) {
    message = JSON.stringify(message) + "?";
    portSerial.write(message, function (err) {
        if (err) {
            console.log('Error on write: ', err.message);
        } else {
            console.log('Serial Message Sent : ' + message);
        }

    });
};

var sendMessageByDevice = function(device){
    var data = {
    "id": device.xbeeId, //deviceId
    "rel": device.relay, //relay
    "ins": device.state, //instruction
    "typ": device.type   //device type (1,2)
    };
    writeSerial(data);
};

module.exports = {
    writeSerial: writeSerial,
    sendMessageByDevice: sendMessageByDevice
}