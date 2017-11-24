var routineModel = require('../models/routineModel');

var get = function (req, res) {
    routineModel.find({}, function (err, routines) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(routines);
        }
    });
}

var post = function (req, res) {
    var routine = new deviceModel(req.body);

    if (!routine.index || !routine.day) {
        res.status(400).send('routine is incomplete');
    } else {









        


        Routine.findAll().then(function (r) {
            
                var randomId = null;
                var routinesFound = [];
                var oneTimeVar = false;
            
                do {
                  randomId = Math.floor((Math.random() * 9999) + 1);
                  routinesFound = r.filter(function (r) {
                    return r.group_id == randomId;
                  });
                } while (routinesFound.length != 0);
            
            
            
                var days = routines[3];
                var devicesAdded = [];
                //devices
                routines[0].forEach(function (element) {
                  devicesAdded.push(element.id);
                });
            
            
                Routine.create({
                  devices: JSON.stringify(devicesAdded),
                  time_on: routines[1],
                  time_off: routines[2],
                  group_id: randomId
                }).then(function () {
            
                  for (var i = 0; i < days.length; i++) {
            
                    var myDay = {
                      index: days[i].index,
                      day: days[i].day,
                      active: days[i].active,
                      class: days[i].class,
                      group_id: randomId
                    }
            
                    DaysRoutine.save(myDay);
            
                  };
            
                  webSockets.updateFrontEndRoutines();
                });
            
            
            
              });


















        routine.save(function (err) {
            if (err) {
                return 500;
            } else {
                //webSockets.notifyFrontEnd();
                res.status(201).send(routine);
            }
        });
    }
}

module.exports = {
    get: get,
    post: post
}