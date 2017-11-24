angular.module('app').controller("accessController", ['$scope', '$http', 'wsClient',
    function ($scope, $http, wsClient) {


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

        //this function is called every time a websocket message is received with type WebSocketsMessageType.DEVICE_DATA
        wsClient().addListener(
            'devices', function setDevices(devices) {
                $scope.devices = devices;
                $scope.$apply();
            
        });


    }
]);