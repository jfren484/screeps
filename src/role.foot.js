/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function(creep) {
        if (creep.memory.renewing) {
            if (Game.spawns['Spawn1'].renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }

            if (creep.ticksToLive >= 1450) {
                creep.memory.renewing = false;
                creep.say('form up');
            }
        } else if (!creep.memory.isInPosition) {
        	creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].soldierPosts);
        } else if (creep.ticksToLive < 200) {
        	creep.memory.isInPosition = false;
        	creep.memory.renewing = true;
        	creep.say('renew');
        }
    }
};