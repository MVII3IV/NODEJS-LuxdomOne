var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routineModel = new Schema({
    devices: {
        type: String
    },
    groupId: {
        type: String
    },
    timeOn: {
        type: String
    },
    timeOff: {
        type: String
    }
});

module.exports = mongoose.model('routines', routineModel);