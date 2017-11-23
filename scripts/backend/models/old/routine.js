var Sequelize = require('sequelize');
var WebSocketsMessageType = require('../enums/WebSocketsMessageTypes.js');
var webSockets = require('../webSockets.js');
var DaysRoutine = require('./daysRoutine.js');

const sequelize = new Sequelize('database.db', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: 'database.db',
  define: {
    timestamps: false
  }
});


var Routine = sequelize.define('routines', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  devices: {
    type: Sequelize.STRING
  },
  group_id: {
    type: Sequelize.INTEGER
  },
  time_on: {
    type: Sequelize.STRING
  },
  time_off: {
    type: Sequelize.STRING
  }
});


var save = function (routines) {


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

};


var update = function (routine) {
  return Routine.update({
    time_on: routine.timeOn,
    time_off: routine.timeOff
  }, {
    where: {
      group_id: routine.groupId
    }
  })
};


var deleteById = function (id) {
  return Routine.destroy({
    where: {
      id: id
    }
  });
};

var deleteByGroupId = function (groupId) {
  return Routine.destroy({
    where: {
      group_id: groupId
    }
  });
};

var getAllByGroupId = function (groupId) {
  return Routine.findAll({
    where: {
      group_id: groupId,
    }
  });
};

var findAll = function () {
  return Routine.findAll({
    raw: true
  }).then(r => {
    return r;
  });
};

module.exports = {
  Routine: Routine,
  save: save,
  findAll: findAll,
  update: update,
  deleteById: deleteById,
  deleteByGroupId: deleteByGroupId,
  getAllByGroupId: getAllByGroupId
}