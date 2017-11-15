angular.module("app").service("deviceService", function () {

    this.newDevice = {
        "name": "",
        "relay": null,
        "action": "Apagado",
        "class": "primary",
        "state": false,
        "xbeeId": "",
        "type": "",
        "watts": 0
    }

});