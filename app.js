var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var DeviceModel = require('./scripts/backend/models/deviceModel.js');




var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());




var port = 80;
app.listen(port, function (error) {
    console.log("running server at port: " + port);
});




mongoose.connect('mongodb://localhost/luxdomOne');
var db = mongoose.connection;

db.on('error', function(err){
    console.log(err);
});
db.on('open', function(){
    console.log('>DB connected');   
});






var webSockets = require('./scripts/backend/webSockets.js');
var serialPort = require('./scripts/backend/serialPort.js');
var scheduler = require('./scripts/backend/scheduler.js');







//load all files
app.use(express.static('public'));
app.use(express.static('scripts/frontend/'));



//Routes
var deviceRouter = require('./scripts/backend/routes/deviceRoutes.js')(DeviceModel);
app.use('/api/devices', deviceRouter);



/*
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
*/