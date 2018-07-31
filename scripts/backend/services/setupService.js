var typesModel = require('../models/typesModel');

var types = function(){
    var standard = new typesModel({
        "id" : 1,
        "name" : "standard",
        "description" : "Dispositivo tipico (focos, radio, television)"
    });

    var pulse = new typesModel({
        "id" : 2,
        "name" : "pulse",
        "description" : "Dispositivo tipo acceso"
    });

    standard.save();
    pulse.save();
}

module.exports = {
    types: types
}