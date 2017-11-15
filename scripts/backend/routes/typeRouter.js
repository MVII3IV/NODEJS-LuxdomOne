var express = require('express');

var routes = function(Types){

    var typesRouter = express.Router();

    typesRouter.route('/')
        .get(function(req, res){
            Types.find({},function(err, types){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.send(types);
                }
            })
        });
    
    return typesRouter;

}

module.exports = routes;