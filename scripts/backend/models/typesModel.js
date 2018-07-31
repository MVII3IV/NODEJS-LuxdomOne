var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typesModel = new Schema({
    id: Number,
    name: String,
    description: String
});


module.exports = mongoose.model('types', typesModel);



/*
{
    "id" : 1,
    "name" : "standard",
    "description" : "Dispositivo tipico (focos, radio, television)"
}
,
{
    "id" : 2,
    "name" : "pulse",
    "description" : "Estos dispositivos comunmente son dispositivos que necesitan ser encendidos durante una fraccion de segundo (puertas)"
}
*/