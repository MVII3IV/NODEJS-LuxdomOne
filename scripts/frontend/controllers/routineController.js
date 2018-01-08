angular.module('app').controller("routineController", ['wsClient', '$scope', '$http', '$q', "routineService", "daysService", function (wsClient, $scope, $http, $q, routineService, daysService) {

    //routine vars
    var endPoint = "/api/routines/";
    $scope.timeOn = "12:00 PM";
    $scope.timeOff = "12:00 PM";
    $scope.test = routineService.test;
    $scope.days = daysService.days;
    $scope.addedDeviceToRoutine = [];
    $scope.devices = [];
    $scope.routines = [];
    //$scope.routines.days = [];
    //$scope.daysRoutine = [];
    $scope.types = [];



    var getRoutinesData = function () {

        routineService.getRoutinesData().then(function (res) {
            $scope.routines = res[0].data;
            //$scope.daysRoutine = res[1].data;
            $scope.types = res[1].data;
            $scope.devices = res[2].data;

            //$scope.routines = routineService.agroupRoutineMembers($scope.routines/*, $scope.devices, $scope.daysRoutine*/);
            //$scope.$apply();
        });
    }

    getRoutinesData();


    //method used to push elements to the an array to then create a routine
    $scope.addDeviceToRoutine = function () {
        var found = $scope.addedDeviceToRoutine.find(function (element) {
            return element === $scope.selectedDevice;
        });

        if (found == undefined) {
            $scope.addedDeviceToRoutine.push($scope.selectedDevice);
        } else {
            $scope.addedDeviceToRoutine = routineService.removeElementById($scope.selectedDevice.id, $scope.addedDeviceToRoutine);
        }
    };

    //when the user is adding devices to a routine, there is an X in each tag, if that x is pressed
    //this function is called and the tag is removed
    $scope.removeDeviceFromCorutine = function (device) {
        $scope.addedDeviceToRoutine = routineService.removeElementById(device.id, $scope.addedDeviceToRoutine);
    };

    $scope.registerNewRoutine = function () {
        $http.post(endPoint, {
            devices: $scope.addedDeviceToRoutine,
            groupId: null, //can be removed after test functionability
            timeOn: $scope.timeOn,
            timeOff: $scope.timeOff,
            days: $scope.days
        }).then(function (res) {
            console.log(res);
            restartRoutineDefaultValues();
        }).catch(function (err) {
            console.log(err);
        });
    };

    $scope.updateRoutineFromDB = function (routine) {
        //wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_ROUTINE, routine);
        $http.patch(endPoint + routine._id, routine)
            .then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
    }

    $scope.removeRoutineFromDB = function (routine) {
        //wsClient.sendMessage(wsClient.WebSocketsMessageType.REMOVE_ROUTINE, routine);
        $http.delete(endPoint + routine._id)
            .then(
                function (res) {
                    console.log(res);
                },
                function (err) {
                    console.log(err);
                });
    };

    /*
    $scope.updateDaysToDB = function (days) {
        wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_DAYS, days);
    }
    */

    $scope.setDay = function (routine, index) {

        var day = routine.days[index];

        if (!day.active) {
            day.class = "btn btn-info";
            day.active = true;
        } else {
            day.class = "btn btn-default";
            day.active = false;
        }

        $scope.updateRoutineFromDB(routine);
        //$scope.updateDaysToDB(day);
    }

    $scope.setDayOnModel = function (day) {
        if (!day.active) {
            day.class = "btn btn-info";
            day.active = true;
        } else {
            day.class = "btn btn-default";
            day.active = false;
        }
    }

    var restartRoutineDefaultValues = function () {
        $scope.selectedDevice = null;
        $scope.days = [{
                "routine_id": 0,
                "day": "D",
                "index": 0,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "L",
                "index": 1,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "M",
                "index": 2,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "X",
                "index": 3,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "J",
                "index": 4,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "V",
                "index": 5,
                "class": "btn btn-default",
                "active": false
            },
            {
                "routine_id": 0,
                "day": "S",
                "index": 6,
                "class": "btn btn-default",
                "active": false
            }
        ];
        $scope.timeOn = "12:00 PM";
        $scope.timeOff = "12:00 PM";
        $scope.addedDeviceToRoutine = [];
    }

    wsClient().addListener('routines', getRoutinesData);



}]);