var Q = require('q');
var serialPort = require('./serialPort.js');
var wsClient = require('./webSockets.js');
var dateFormat = require('dateformat');

//Models
var routineModel = require('./models/routine.js');
var deviceModel = require('./models/device.js');
var daysModel = require('./models/daysRoutine.js');
var deviceController = require('./controllers/deviceController.js');

var minutes = 1;
var interval = minutes * 60 * 1000;


setInterval(function () {
    console.log("Checking Routines");



    Q.all([daysModel.findAll(), routineModel.findAll(), deviceModel.findAll()]).then(function (data) {

        var days = data[0];
        var routines = data[1];
        var devices = data[2];


        days = days.filter(function (day) {
            return day.index == new Date().getDay() && day.active == true;
        });


        var routines = routines.filter(function (routine) {
            return days.some(function (day) {
                return day.group_id == routine.group_id;
            })
        });


        devices.filter(function (device) {
            routines.some(function (routine) {   
                JSON.parse(routine.devices).some(function (r) {
                    if (r == device.id) {
                        actionPerformer(device, routine);
                    }
                });
            });
        });


    });


}, interval);





var actionPerformer = function (device, routine) {
    /*
    var currentTime = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    */

    var currentTime = dateFormat("shortTime");   
    console.log('Current time: ' + currentTime + ' Scheduled time: ' + routine.time_on );

    if (routine.time_on == currentTime) {
        deviceController.turnOnDevice(device);
    }

    if (routine.time_off == currentTime) {
        deviceController.turnOffDevice(device);
    }
}