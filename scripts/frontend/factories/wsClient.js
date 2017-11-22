angular.module('app').factory('wsClient', [function () {

    var self = this;
    var listeners = [];

    self.WebSocketsMessageType = {
        ORDER_INSTRUCTION: 1,
        SAVE_DEVICE: 2,
        SAVE_ROUTINE: 3,
        DEVICE_DATA: 4,
        TYPE_DATA: 5,
        REMOVE_DEVICE: 6,
        UPDATE_DEVICE: 7,
        ROUTINES_DATA: 8,
        UPDATE_ROUTINE: 9,
        REMOVE_ROUTINE: 10,
        UPDATE_DAYS: 11
    }

    var ws = new WebSocket('ws://' + window.location.host + ':8080');

    ws.onopen = function () {
        console.log('Connected');
    };

    self.sendMessage = function (type, payload) {

        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: type,
                payload: payload
            }));
        } else {
            setTimeout(function () {
                self.sendMessage(type, payload);
            }, 500);
        }

    }

    ws.onmessage = function (msg) {

        msg = JSON.parse(msg.data);
        switch (msg.type) {


            //add devices
            case self.WebSocketsMessageType.DEVICE_DATA:
                var devices = msg.payload;
                listeners.forEach(function(listener){
                    listener(devices);
                });
                break;

            case self.WebSocketsMessageType.TYPE_DATA:
                var types = msg.payload;
                break;

            default:
                "";
                break;


        }
       // $scope.$apply();
    }

    self.addListener = function(listener){
            listeners.push(listener);
    }

    self.ws = ws;

    return self;

}]);