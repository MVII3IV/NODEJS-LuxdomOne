var Sequelize = require('sequelize');
var WebSocketsMessageType = require('../enums/WebSocketsMessageTypes.js');
var webSockets = require('../webSockets.js');

const sequelize = new Sequelize('database.db', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    // SQLite only
    storage: 'database.db',
    define: {
        timestamps: false
    }
});


var DaysRoutine = sequelize.define('routine_days', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    index: {
        type: Sequelize.INTEGER
    },
    group_id: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.TEXT
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    class: {
        type: Sequelize.STRING
    }
});



var findAll = function () {
    return DaysRoutine.findAll({raw: true}).then(d => {
        return d;
    });
};

var findById = function (id) {
    // return the promise itself
    return DaysRoutine.findAll({
        where: {
            routine_id: id
        }
    }).then(function (days) {
        if (!days) {
            return 'not find';
        }
        return days;
    });
};

var getGroupIdsByIndex = function (index) {
    return DaysRoutine.findAll({
        where: {
            index: index,
            active: true
        },
        attributes:['group_id']
    });
};

var save = function (daysRoutine) {
    DaysRoutine.create({
        day: daysRoutine.day,
        index: daysRoutine.index,
        active: daysRoutine.active,
        class: daysRoutine.class,
        group_id: daysRoutine.group_id
    });
};

var update = function (day) {

    return DaysRoutine.update({
        index: day.index,
        day: day.day,
        active: day.active,
        class: day.class
    }, {
        where: {
            id: day.id
        }
    }).then(function () {

    })


};

var deleteById = function (id) {
    return DaysRoutine.destroy({
        where: {
            routine_id: id
        }
    });
};

var deleteByGroupId = function (group_id) {
    return DaysRoutine.destroy({
        where: {
            group_id: group_id
        }
    });
};


module.exports = {
    save: save,
    update: update,
    findById: findById,
    findAll: findAll,
    deleteById: deleteById,
    deleteByGroupId: deleteByGroupId,
    getGroupIdsByIndex: getGroupIdsByIndex
}