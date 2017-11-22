angular.module("app").service("deviceService", ['$http', function ($http) {

    this.newDevice = {
        "name": "",
        "relay": null,
        "action": "En reposo",
        "class": "primary",
        "state": false,
        "xbeeId": "",
        "type": "",
        "watts": 0
    }

}]);