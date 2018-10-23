angular.module('app').controller("accessController", ['$scope', '$http', 'wsClient',
    function ($scope, $http, wsClient) {


        $http.get('/api/devices')
            .then(function (response) {
                $scope.devices = response.data;
            }).catch(function (err) {
                console.log(err);
            });


        $scope.activate = function (device) {
            if($scope.timeDiff > 2){
                $http.post("/api/access/activate", device)
                .then(function (res) {
                    console.log(res);
                }).catch(function (err) {
                    console.log(err);
                });
            }else{
                $scope.timeDiff = 0;
            }           
        }

        //this function is called every time a websocket message is received with type WebSocketsMessageType.DEVICE_DATA
        wsClient().addListener(
            'devices', function setDevices(devices) {
                $scope.devices = devices;
                $scope.$apply();
            
        });

        $scope.mouseDown = function () {
            timeStart = new Date();
        }

        $scope.mouseUp = function () {
            timeEnd = new Date();
            $scope.timeDiff = (timeEnd - timeStart)/1000;
            console.log($scope.timeDiff);
        }  


    }
]);