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
                creep.say('defend');
            }
        } else if (creep.memory.isInPosition) {
            let nearbyHostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                                           
            if (nearbyHostileCreeps.length === 1) {
                creep.rangedAttack(nearbyHostileCreeps[0]);
            } else if (nearbyHostileCreeps.length > 1) {
                creep.rangedMassAttack();
            } else if (creep.ticksToLive < 500) {
                creep.memory.isInPosition = false;
                creep.memory.renewing = true;
                creep.say('renew');
            }
        } else {
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].sentryPosts);
        }
    }
};