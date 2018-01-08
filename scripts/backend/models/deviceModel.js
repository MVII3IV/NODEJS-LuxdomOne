var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devicesModel = new Schema({
  name: String,
  relay: Number,
  action: String,
  class: String,
  state: Boolean,
  xbeeId: String,
  type: Number,
  watts: Number
});

module.exports = mongoose.model('devices', devicesModel);


/*
{
	"name": "test",
    "relay": 0,
    "action":"Apagado",
    "class": "primary",
    "state": 0,
    "xbeeId": "0013A200_40EAE365",
    "type": 1,
    "watts": 13
}
*/