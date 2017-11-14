var express = require('express');

var routes = function(DeviceModel){

    var deviceRouter = express.Router();

    deviceRouter.route('/')
        .get(function(req, res){
            res.send('devices api');
        });

    return routes;
};

module.exports = routes;