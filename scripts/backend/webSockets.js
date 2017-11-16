//Packages
const WebSocket = require('ws');
var Q = require('q');


module.exports = function (Devices, Types) {
  var self = this;
  //Models
  //var serialPort = require('./serialPort.js');
  //var typeModel = require('./models/types.js');
  var WebSocketsMessageType = require('./enums/WebSocketsMessageTypes.js');


  //Vars
  var devices = [];
  var types = [];

  var wSocket = null;
  self.wss = new WebSocket.Server({
    port: 8080
  });



  wss.on('connection', function connection(ws) {

    wSocket = ws;
    //once the devices are found we are able to send a ws message with that information to de FE
    Devices.find({}, function (err, devices) {
      console.log(devices);
    });



    Q.all([Devices.find({}).exec(), Types.find({}).exec()]).then(function (data) {
      devices = data[0];
      types = data[1];
      onNewConnection(ws);
    });


    ws.on('message', function incoming(message) {
      onNewMessageReceived(message);
    });

  });


  //send devices via WS to the FE when a new connection is detected
  var onNewConnection = function (ws) {
    sendMessage(WebSocketsMessageType.DEVICE_DATA, devices);
    sendMessage(WebSocketsMessageType.TYPE_DATA, types);
  };


  var onNewMessageReceived = function (message) {

    var data = JSON.parse(message);

    switch (data.type) {

      //ORDER INSTRUCTION TO TURN ON/OFF A LIGHT
      case WebSocketsMessageType.ORDER_INSTRUCTION:
        deviceController.toggleDevice(data.payload);
        break;

        //USED TO CRUD DEVICES BY DEVICE MANAGER
      case WebSocketsMessageType.SAVE_DEVICE:
        //save a new device in to the database
        deviceModel.save(data.payload);
        break;

      case WebSocketsMessageType.UPDATE_DEVICE:
        deviceModel.update(data.payload);
        updateFrontEndDevices();
        break;

      case WebSocketsMessageType.REMOVE_DEVICE:
        //save a new device in to the database
        deviceModel.deleteById(data.payload);
        updateFrontEndDevices();
        break;



        //CRUD ROUTINE
      case WebSocketsMessageType.SAVE_ROUTINE:
        routineModel.save(data.payload);
        break;

      case WebSocketsMessageType.ROUTINES_DATA:
        routineModel.findAll().then(function (routines) {
          sendMessage(WebSocketsMessageType.ROUTINES_DATA, routines);
        });
        break;

      case WebSocketsMessageType.UPDATE_ROUTINE:
        routineModel.update(data.payload).then(function () {
          updateFrontEndRoutines();
        });
        break;

      case WebSocketsMessageType.REMOVE_ROUTINE:
        routineModel.deleteByGroupId(data.payload.groupId)
          .then(function () {
            daysModel.deleteByGroupId(data.payload.groupId).then(function () {
              updateFrontEndRoutines();
            });
          });
        break;


        //DAYS
      case WebSocketsMessageType.UPDATE_DAYS:
        daysModel.update(data.payload).then(function () {
          updateFrontEndRoutines();
        });
        break;
    }
  };

  
    //Front End Updater : using as parameter devices
    var updateFrontEndByDevices = function (devices) {
      sendMessageAllClients(WebSocketsMessageType.DEVICE_DATA, devices);
    };

    //Front End Updater : without devices
    var updateFrontEndDevices = function () {
      deviceModel.findAll().then(function (devices) {
        sendMessageAllClients(WebSocketsMessageType.DEVICE_DATA, devices);
      });
    };


    var updateFrontEndRoutines = function () {

      daysModel.findAll().then(function (days) {
        var daysRoutine = days;
        routineModel.findAll().then(function (routines) {

          for (var i = 0; i < routines.length; i++) {
            var days = daysRoutine.filter(function (day) {
              return day.routine_id == routines[i].id;
            });

            routines[i].days = [];
            routines[i].days = days;
          }

          sendMessageAllClients(WebSocketsMessageType.ROUTINES_DATA, routines);
        });
      });

    };

    var sendMessage = function (msgType, payload) {
      wSocket.send(JSON.stringify({
        type: msgType,
        payload: payload
      }));
    };


    var sendMessageAllClients = function (msgType, payload) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: msgType,
            payload: payload
          }));
        }
      });
    };



    //Controllers
    var deviceController = require('./controllers/deviceController.js');
    var routineModel = require('./models/routine.js');
    var deviceModel = require('./models/device.js');
    var daysModel = require('./models/daysRoutine.js');

};

//module.exports = {
//sendMessage: sendMessage,
//wss: wss,
//WebSocket: WebSocket,
//webSocket: websocket
//updateFrontEndDevices: updateFrontEndDevices,
//updateFrontEndByDevices: updateFrontEndByDevices,
//sendMessageAllClients: sendMessageAllClients,
//updateFrontEndRoutines: updateFrontEndRoutines
//}