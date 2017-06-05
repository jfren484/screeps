/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        const destPos = new RoomPosition(creep.memory.destinationX, creep.memory.destinationY, creep.memory.destinationRoom);

        if (creep.pos.isEqualTo(destPos)) {
            delete creep.memory.destinationX;
            delete creep.memory.destinationY;
            delete creep.memory.destinationRoom;

            creep.memory.action = gameData.creepRoles[creep.memory.role].defaultAction;
            creep.say(creep.memory.action);
            creep.memory.role = creep.memory.futureRole;
            delete creep.memory.futureRole;
        } else {
            creep.moveTo(destPos);
        }
    }
};