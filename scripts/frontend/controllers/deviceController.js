angular.module('app').controller("deviceController", ['$scope', '$http', 'wsClient', 'deviceService',
    function ($scope, $http, wsClient, deviceService) {

        $scope.title = "Luxdom One";
        $scope.selectedDevice = null;
        $scope.selectedType = null;
        $scope.devices = [];
        $scope.types = [];
        $scope.newDevice = deviceService.newDevice;
        $scope.types;
        $scope.devices;


        $http.get('/api/devices')
            .then(function (response) {
                $scope.devices = response.data;
            }).catch(function (err) {
                console.log(err);
            });

        $http.get('/api/types')
            .then(function (response) {
                $scope.types = response.data;
            }).catch(function (err) {
                console.log(err);
            });


        $scope.toggle = function (device) {
            postData('/api/devices/toggle', device);
        };

        $scope.registerNewDevice = function (device) {
            device.relay -= 1;
            device.type = device.type.id;
            postData('/api/devices/', device);
        };

        $scope.removeDeviceFromDB = function (device) {
            $http.delete('/api/devices/' + device._id)
                .then(
                    function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.log(err);
                    });
        };

        $scope.updateDeviceFromDB = function (device) {
            //wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_DEVICE, device);
            $http.patch('/api/devices/' + device._id, device)
                .then(function (res) {
                    console.log(res);
                }).catch(function (err) {
                    console.log(err);
                });
        };

        function postData(URL, data) {
            $http.post(URL, data)
                .then(function (res) {
                    console.log(res);
                }).catch(function (err) {
                    console.log(err);
                });
        }


        wsClient().addListener(
            'devices', function setDevices(devices) {
                $scope.devices = devices;
                $scope.$apply();
            
        });


    }
]);