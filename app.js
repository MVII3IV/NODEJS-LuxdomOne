var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

//models
var DeviceModel = require('./scripts/backend/models/deviceModel');
var TypeModel = require('./scripts/backend/models/typesModel');




var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



//load all files
app.use(express.static('public'));
app.use(express.static('scripts/frontend/'));



var port = 80;
app.listen(port, function (error) {
    console.log("running server at port: " + port);
});




mongoose.connect('mongodb://localhost/luxdomOne', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;


db.on('error', function (err) {
    console.log(err);
});
db.on('open', function () {
    console.log('>DB connected');
});



var webSockets = require('./scripts/backend/webSockets');
//var serialPort = require('./scripts/backend/serialPort.js');
//var scheduler = require('./scripts/backend/scheduler.js');


//Routes
var deviceRouter = require('./scripts/backend/routes/deviceRoutes')(DeviceModel);
var typesRouter = require('./scripts/backend/routes/typeRouter')(TypeModel);

app.use('/api/devices', deviceRouter);
app.use('/api/types', typesRouter);