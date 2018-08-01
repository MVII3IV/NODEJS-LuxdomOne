const WebSocket = require('ws');
var WebSocketsMessageType = require('./enums/WebSocketsMessageTypes');
var deviceModel = require('./models/deviceModel');
var typeModel = require('./models/typesModel');
var routinesModel = require('./models/routineModel');
var Q = require('q');


//Vars
var devices = [];
var types = [];
var wSocket = null;
const wss = new WebSocket.Server({
  port: 8080
});


wss.on('connection', function connection(ws) {

  wSocket = ws;
  //once the devices are found we are able to send a ws message with that information to de FE

  //notifyFrontEnd();

  ws.on('message', function incoming(message) {
    onNewMessageReceived(message);
  });

});


//send devices via WS to the FE when a new connection is detected
var notifyFrontEnd = function () {

  Q.all([deviceModel.find({}).exec(), typeModel.find({}).exec()]).then(function (data) {
    devices = data[0];
    types = data[1];

    updateFrontEndByDevices(devices);
    sendMessage(WebSocketsMessageType.TYPE_DATA, types);

  });
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
  deviceModel.find({}, function (err, devices) {
    sendMessageAllClients(WebSocketsMessageType.DEVICE_DATA, devices);
  });
};

var updateFrontEndRoutines = function () {

  routinesModel.find({}, function(err, routines){
    sendMessageAllClients(WebSocketsMessageType.ROUTINES_DATA, routines);
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
  updateFrontEndByDevices: updateFrontEndByDevices,
  updateFrontEndDevices: updateFrontEndDevices,
  updateFrontEndRoutines: updateFrontEndRoutines
}