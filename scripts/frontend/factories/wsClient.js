angular.module('app').factory('wsClient', [function () {


    return webSocketClient = function () {

        var listeners = [];

        if (arguments.length > 0) {
            for (var i = 0; i < arguments[0].length; i++) {
                listeners.push(arguments[0][i]);
            }
        }

        var self = {};
        var WEBSOCKET_SERVER = 'ws://' + window.location.host + ':8080';

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

        var ws = new WebSocket(WEBSOCKET_SERVER);

        ws.onopen = function () {
            console.log('Connected' + ws);
        };

        ws.onclose = function () {
            console.log('disconnected' + ws);

            setTimeout(function () {
                webSocketClient(listeners);
            }, 1000);

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
                    listeners.forEach(function (listener) {
                        listener(devices);
                    });
                    break;

                case self.WebSocketsMessageType.TYPE_DATA:
                    var types = msg.payload;
                    break;

                case wsClient.WebSocketsMessageType.ROUTINES_DATA:
                    getRoutinesData();
                    break;
                    
                default:
                    "";
                    break;


            }
            // $scope.$apply();
        }

        self.addListener = function (listener) {
            listeners.push(listener);
        }

        self.ws = ws;

        return self;
    }

}]);