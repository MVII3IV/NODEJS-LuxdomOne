var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deviceModel = require('./deviceModel');
var daysModel = require('./daysModel');

var routineModel = new Schema({
    devices: [deviceModel.schema],
    groupId: String,
    timeOn: String,
    timeOff: String,
    days: [daysModel.schema]
});

module.exports = mongoose.model('routines', routineModel);