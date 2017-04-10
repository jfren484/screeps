/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function(creep) {
        if (!creep.memory.renewing && !creep.spawning && creep.ticksToLive < 200) { // When spawning, apparently ticksToLive is 0
            creep.memory.upgrading = false;
            creep.memory.renewing = true;
            creep.say('renew');
        } else if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('load');
        } else if (creep.memory.renewing && (creep.ticksToLive >= gameData.renewThreshold || creep.room.energyAvailable < 50)) {
            creep.memory.renewing = false;
            creep.say('load');
        } else if (!creep.memory.upgrading && !creep.memory.renewing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.memory.isInPosition = false;
            creep.say('upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.memory.isInPosition) {
                creep.upgradeController(creep.room.controller);
            } else {
                creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].posts.upgrader);
            }
        } else if (creep.memory.renewing) {
            creep.moveTo(creep.spawn);
            if (!creep.room.energyAvailable && creep.energy) {
                creep.transfer(creep.spawn, RESOURCE_ENERGY);
            }
        } else {
            let containers = creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                return s.structureType === STRUCTURE_CONTAINER && s.store.energy > 0;
            }});

            if (containers.length) {
                let container = _.sortBy(containers, function(c) {
                    return creep.pos.getRangeTo(c);
                })[0];

                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};