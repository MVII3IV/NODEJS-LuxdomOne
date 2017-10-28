var Sequelize = require('sequelize');



const sequelize = new Sequelize('database.db', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: 'database.db',
  define: {
    timestamps: false
  }
});

var types = [];


var Type = sequelize.define('types', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  }
});

Type.findAll().then(t => {
  types = t;
  module.exports.types = types;
});

var findAll = function(){
    return Type.findAll().then(t => {
      return t;
    });
};

module.exports = {
    findAll: findAll
}
