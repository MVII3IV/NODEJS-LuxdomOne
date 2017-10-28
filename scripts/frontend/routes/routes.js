angular.module("app").config(
    function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'pages/home/home.html',
            controller: 'mainController'
        })

        .when('/devices', {
            templateUrl: 'pages/devices/devices.html',
            controller: 'deviceController'
        })

        .when('/cp/devices', {
            templateUrl: 'pages/control-panel/device-manager.html',
            controller: 'deviceController'
        })

        .when('/cp/routines', {
            templateUrl: 'pages/control-panel/routine-manager.html',
            controller: 'routineController'
        });
});