angular.module("app").service("routineService", function ($q, $http) {


    this.getRoutinesData = function () {
        return $q.all([
            $http.get('/api/routines'),
            //$http.get('/api/daysroutine'), 
            $http.get('/api/types'), 
            $http.get('/api/devices')]);
    };

/*
     this.agroupRoutineMembers = function (routines, devices, days) {
        var agroupedRoutines = [];

        var groups = {};

        for (var i = 0; i < routines.length; i++) {

            var groupId = routines[i].group_id;

            if (!groups[groupId]) {
                groups[groupId] = [];
                groups[groupId].devices = [];
                groups[groupId].timeOn = null;
                groups[groupId].timeOff = null;
                groups[groupId].groupId = groupId;
                groups[groupId].days = [];
                groups[groupId].id = null;
            }


            routines[i].devices = JSON.parse(routines[i].devices);
            routines[i].devices.forEach(function (deviceId) {

                var name = devices.find(function (device) {
                    return device.id == deviceId;
                }).name;

                groups[groupId].devices.push({
                    id: deviceId,
                    name: name,
                });

            });

            groups[groupId].timeOn = routines[i].time_on;
            groups[groupId].timeOff = routines[i].time_off;
            groups[groupId].id = routines[i].id;
        }

        for (var groupName in groups) {
            agroupedRoutines.push({
                groupId: groupName,
                devices: groups[groupName].devices,
                timeOn: groups[groupName].timeOn,
                timeOff: groups[groupName].timeOff,
                id: groups[groupName].id
            });
        }

        return routinePlusDays(agroupedRoutines, days);

    };
*/

    var routinePlusDays = function (routines, days) {

        for (var i = 0; i < routines.length; i++) {
            routines[i].days = getDaysByRoutineID(routines[i].groupId, routines, days);
        }

        return routines;
    };


    var getDaysByRoutineID = function (id, routines, days) {
        return days.filter(function (day) {
            return day.group_id == id;
        });
    };

    //$scope.addedDeviceToRoutine
    this.removeElementById = function (id, addedDeviceToRoutine) {
        var removeIndex = addedDeviceToRoutine.map(function (item) {
            return item.id;
        }).indexOf(id);
        addedDeviceToRoutine.splice(removeIndex, 1);
        return addedDeviceToRoutine;
    };

});