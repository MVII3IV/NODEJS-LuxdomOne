var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var daysModel = new Schema({
    index: {
        type: Number
    },
    groupId: {
        type: Number
    },
    day: {
        type: String
    },
    active: {
        type: Boolean
    },
    class: {
        type: String
    }
});

module.exports = mongoose.model('days', daysModel);