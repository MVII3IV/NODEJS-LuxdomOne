angular.module('app').controller("deviceController", ['$scope', '$http', 'wsClient', 'deviceFactory', 'deviceService',
    function ($scope, $http, wsClient, deviceFactory, deviceService) {

        $scope.title = "Luxdom One";
        $scope.selectedDevice = null;
        $scope.selectedType = null;
        $scope.devices = [];
        $scope.types = [];
        $scope.newDevice = deviceService.newDevice;


        $http.get('/types').then(function (response) {
            $scope.types = response.data;
        });

        $http.get('/devices').then(function (response) {
            $scope.devices = response.data;
        });


        wsClient.ws.onmessage = function (msg) {

            msg = JSON.parse(msg.data);
            switch (msg.type) {


                //add devices
                case wsClient.WebSocketsMessageType.DEVICE_DATA:
                    $scope.devices = msg.payload;
                    break;

                case wsClient.WebSocketsMessageType.TYPE_DATA:
                    $scope.types = msg.payload;
                    break;

                default:
                    "";
                    break;


            }
            $scope.$apply();
        }



        $scope.toggle = function (device) {
            wsClient.sendMessage(wsClient.WebSocketsMessageType.ORDER_INSTRUCTION, device);
        };

        $scope.registerNewDevice = function (device) {
            device.relay -= 1;
            device.xbee_id = "0013A200_40EAE365"; //improove this line
            device.type = device.type.id;
            wsClient.sendMessage(wsClient.WebSocketsMessageType.SAVE_DEVICE, device);
        };

        $scope.removeDeviceFromDB = function (device) {
            wsClient.sendMessage(wsClient.WebSocketsMessageType.REMOVE_DEVICE, device);
        };

        $scope.updateDeviceFromDB = function (device) {
            wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_DEVICE, device);
        };


    }
]);