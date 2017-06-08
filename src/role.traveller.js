/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        if (creep.pos.isEqualTo(creep.destinationPos)) {
            delete creep.memory.destinationX;
            delete creep.memory.destinationY;
            delete creep.memory.destinationRoom;

            creep.memory.role = creep.memory.futureRole;
            creep.memory.action = gameData.creepRoles[creep.memory.role].defaultAction;
            creep.say(creep.memory.action);
            delete creep.memory.futureRole;
        } else {
            creep.moveTo(creep.destinationPos);
        }
    }
};