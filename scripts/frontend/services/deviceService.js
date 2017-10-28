angular.module("app").service("deviceService", function () {

    this.newDevice = {
        "name": "",
        "relay": null,
        "action": "Apagado",
        "class": "primary",
        "state": false,
        "xbee_id": "0013A200_40EAE365",
        "type": "",
        "watts": 0
    }

});