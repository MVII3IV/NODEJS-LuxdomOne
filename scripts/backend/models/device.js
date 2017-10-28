var Sequelize = require('sequelize');



const sequelize = new Sequelize('database.db', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: 'database.db',
  define: {
    timestamps: false
  }
});

var devices = [];


var Device = sequelize.define('device', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  relay: {
    type: Sequelize.INTEGER
  },
  action: {
    type: Sequelize.STRING
  },
  class: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.BOOLEAN
  },
  xbee_id: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  watts: {
    type: Sequelize.INTEGER
  }

});


Device.findAll().then(d => {
  devices = d;
  module.exports.devices = devices;
});



//the save function stores data into the database and then broadcasts a message
//to all the websockets clients in order to update the front end and visualize
//the new device in all the conection clients
var save = function (device) {
  Device.create({
    name: device.name,
    relay: device.relay,
    action: device.action,
    class: device.class,
    state: device.state,
    xbee_id : device.xbee_id,
    type : device.type,
    watts : device.watts
  }).then(function () {

      //get information about all the devices stored in the DB
      Device.findAll().then(d => {

              //sends a broadcast message to all clients
              ws.wss.clients.forEach(function each(client) {
                if (client.readyState === ws.WebSocket.OPEN) {
                  client.send(JSON.stringify(  {type: 4, payload: d}  ));
                }
              });

      });


  });
};

var update = function(device){
  return Device.update(
    {
      id : device.id,
      name: device.name,
      relay: device.relay,
      action: device.action,
      class: device.class,
      state: device.state,
      xbee_id : device.xbee_id,
      type : device.type,
      watts : device.watts
    },
      {
        where: {id : device.id 
      }
    }
  ).then(function(){
    //with this code devices is updated according to the device received
    var index = devices.findIndex(i => i.id === device.id);
    devices[index] = device;
  })
};

var deleteById = function(device){
  return Device.destroy({
      where: {
          id: device.id
      }
  });
};



var findAll = function(){
    return Device.findAll({raw: true}).then(d => {
      return d;
    });
};

var findById = function(id){
    // return the promise itself
    return Device.find({
        where: {
           id: id
        }
     }).then(function(device) {
        if (!device) {
            return 'not find';
        }
        return device.dataValues;
     });
};

module.exports = {
  Device: Device,
  save: save,
  update: update,
  devices : null,
  findById : findById ,
  findAll : findAll,
  deleteById: deleteById
}

var ws = require('../webSockets.js');

