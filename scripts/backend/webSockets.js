  var WebSocketsMessageType = require('./enums/WebSocketsMessageTypes');
  var deviceModel = require('./models/deviceModel');
  var typeModel = require('./models/typesModel');
  var WebSocket = require('ws');
  var Q = require('q');


  //Models
  //var serialPort = require('./serialPort.js');



  //Vars
  var devices = [];
  var types = [];

  var wSocket = null;
  var wss = new WebSocket.Server({
    port: 8080
  });



  wss.on('connection', function connection(ws) {

    wSocket = ws;
    //once the devices are found we are able to send a ws message with that information to de FE
    Q.all([deviceModel.find({}).exec(), typeModel.find({}).exec()]).then(function (data) {
      devices = data[0];
      types = data[1];
      notifyFrontEnd(ws);
    });


    ws.on('message', function incoming(message) {
      onNewMessageReceived(message);
    });

  });


  //send devices via WS to the FE when a new connection is detected
  var notifyFrontEnd = function (ws) {
    sendMessage(WebSocketsMessageType.DEVICE_DATA, devices);
    sendMessage(WebSocketsMessageType.TYPE_DATA, types);
  };


  var onNewMessageReceived = function (message) {

    var data = JSON.parse(message);

    switch (data.type) {

      case WebSocketsMessageType.UPDATE_DEVICE:
        deviceModel.update(data.payload);
        updateFrontEndDevices();
        break;

    };
  }


  var updateFrontEndByDevices = function (devices) {
    sendMessageAllClients(WebSocketsMessageType.DEVICE_DATA, devices);
  };

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

  module.exports = {
    notifyFrontEnd: notifyFrontEnd,
    sendMessage: sendMessage,
    sendMessageAllClients: sendMessageAllClients,
    updateFrontEndByDevices: updateFrontEndByDevices
  }