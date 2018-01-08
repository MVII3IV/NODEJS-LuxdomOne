var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var daysModel = new Schema({
    index: Number,
    groupId: Number,
    day: String,
    active: Boolean,
    class: String
});

module.exports = mongoose.model('days', daysModel);