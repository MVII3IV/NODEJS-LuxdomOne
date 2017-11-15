var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devicesModel = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  relay: {
    type: Number
  },
  action: {
    type: String
  },
  class: {
    type: String
  },
  state: {
    type: Boolean
  },
  xbeeId: {
    type: String
  },
  type: {
    type: Number
  },
  watts: {
    type: Number
  }
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
