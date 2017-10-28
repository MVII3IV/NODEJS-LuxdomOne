//var devices = require('./scripts/devices.json');
var bodyParser = require('body-parser');
var express = require('express');


var webSockets = require('./scripts/backend/webSockets.js');
var serialPort = require('./scripts/backend/serialPort.js');
var scheduler = require('./scripts/backend/scheduler.js');


//models
var DeviceModel = require('./scripts/backend/models/device.js');
var RoutineModel = require('./scripts/backend/models/routine.js');
var TypesModel = require('./scripts/backend/models/types.js');
var DaysRoutine = require('./scripts/backend/models/daysRoutine.js');



var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var port = 80;
app.listen(port, function (error) {
    console.log("running server at port: " + port);
});



//load all files
app.use(express.static('public'));
app.use(express.static('scripts/frontend/'));





app.get('/devices', function (req, res) {
    DeviceModel.findAll().then(function (devices) {
        res.send(devices);
    });
});

app.get('/routines', function (req, res) {
    RoutineModel.findAll().then(function (routines) {
        res.send(routines);
    });
});

app.get('/types', function (req, res) {
    TypesModel.findAll().then(function (types) {
        res.send(types);
    });
});

app.get('/days-routine', function (req, res) {
    DaysRoutine.findAll().then(function (days) {
        res.send(days);
    });
});