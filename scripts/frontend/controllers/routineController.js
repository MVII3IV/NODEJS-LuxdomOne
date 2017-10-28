angular.module('app').controller("routineController", ['wsClient', '$scope', '$http', '$q', "routineService", "daysService", function (wsClient, $scope, $http, $q, routineService, daysService) {

    //routine vars
    $scope.timeOn = "12:00 PM";
    $scope.timeOff = "12:00 PM";
    $scope.test = routineService.test;
    $scope.days = daysService.days;
    $scope.addedDeviceToRoutine = [];
    $scope.devices = [];
    $scope.routines = [];
    $scope.routines.days = [];
    $scope.daysRoutine = [];
    $scope.types = [];



    var getRoutinesData = function(){

        routineService.getRoutinesData().then(function (res) {
            $scope.routines = res[0].data;
            $scope.daysRoutine = res[1].data;
            $scope.types = res[2].data;
            $scope.devices = res[3].data;

            $scope.routines = routineService.agroupRoutineMembers($scope.routines, $scope.devices, $scope.daysRoutine);
        });
    }

    getRoutinesData();


    wsClient.ws.onmessage = function (msg) {

        msg = JSON.parse(msg.data);
        switch (msg.type) {

            //routines updates
            case wsClient.WebSocketsMessageType.ROUTINES_DATA:
                getRoutinesData();
                break;

            default:
                "";
                break;

        }
        $scope.$apply();
    };


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
        wsClient.sendMessage(wsClient.WebSocketsMessageType.SAVE_ROUTINE, [$scope.addedDeviceToRoutine, $scope.timeOn, $scope.timeOff, $scope.days]);
        restartRoutineDefaultValues();
    };

    $scope.updateRoutineFromDB = function (routine) {
        wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_ROUTINE, routine);
    }

    $scope.removeRoutineFromDB = function (routine) {
        wsClient.sendMessage(wsClient.WebSocketsMessageType.REMOVE_ROUTINE, routine);
    };

    $scope.updateDaysToDB = function (days) {
        wsClient.sendMessage(wsClient.WebSocketsMessageType.UPDATE_DAYS, days);
    }

    $scope.setDay = function (day) {
        if (!day.active) {
            day.class = "btn btn-info";
            day.active = true;
        } else {
            day.class = "btn btn-default";
            day.active = false;
        }

        $scope.updateDaysToDB(day);
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

    

    

}]);