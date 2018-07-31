angular.module("app").service("routineService", function ($q, $http) {


    this.getRoutinesData = function () {
        return $q.all([
            $http.get('/api/routines'),
            //$http.get('/api/daysroutine'), 
            $http.get('/api/types'), 
            $http.get('/api/devices')]);
    };


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