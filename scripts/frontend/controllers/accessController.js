angular.module('app').controller("accessController", ['$scope', '$http', 'wsClient', 'deviceFactory', 'deviceService', 'accessService',
    function ($scope, $http, wsClient, deviceFactory, deviceService, accessService) {



        $http.get('/api/devices')
            .then(function (response) {
                $scope.devices = response.data;
            }).catch(function (err) {
                console.log(err);
            });

        $scope.activate = function (device) {
            $http.post("/api/access/activate", device)
                .then(function (res) {
                    console.log(res);
                }).catch(function (err) {
                    console.log(err);
                });
        }

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

    }
]);