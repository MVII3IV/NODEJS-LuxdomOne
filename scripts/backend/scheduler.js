var q = require('q');
var serialPort = require('./serialPort.js');
var wsClient = require('./webSockets.js');
var dateFormat = require('dateformat');

//Models
var routineModel = require('./models/routineModel');
var deviceModel = require('./models/deviceModel.js');
var daysModel = require('./models/daysModel.js');

//Services
var deviceService = require('./services/deviceService.js');


var minutes = 1;
var interval = minutes * 60 * 1000;


setInterval(function () {
    console.log("Checking Routines");
    q.all([ routineModel.find({}).exec() ]).then(function (data) {

        var routines = data[0];


        routines.filter(function(routine){

             var days = false;
             routine.days.filter(function (day) {
                if(day.index == new Date().getDay() && day.active == true)
                    days = true;
            });

            if(!days) return;

            var devices = routine.devices.filter(function(device){
                return device.name != null
            });

            if(!devices) return;

            actionPerformer(routine);
        });

    });


}, interval);


var actionPerformer = function (routine) {
    var currentTime = dateFormat("shortTime");
    console.log('Current time: ' + currentTime + ' Scheduled time: ' + routine.timeOn);

    routine.devices.forEach(device => {
        if (routine.timeOn == currentTime) {
            deviceService.turnOnDevice(device);            
        }

        if (routine.timeOff == currentTime) {
            deviceService.turnOffDevice(device);
        }
    });    
}