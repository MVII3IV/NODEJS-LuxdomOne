var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typesModel = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('types', typesModel);



/*
{
    "id" : 2,
    "name" : "pulse",
    "description" : "none"
}
*/