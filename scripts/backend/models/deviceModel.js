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
  xbee_id: {
    type: String
  },
  type: {
    type: String
  },
  watts: {
    type: Number
  }
});

module.exports = mongoose.model('devices', devicesModel);