/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

function resume(creep, target) {
    creep.memory.dispensing = false;
    creep.memory.renewing = false;
    creep.memory.isInPosition = false;

    creep.say(target ? 'scavenge' : 'post');
}

module.exports = {
    run: function (creep) {
        let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        if (creep.memory.renewing) {
            if (creep.ticksToLive >= gameData.renewThreshold || target) {
                resume(creep, target);
            }
        } else if (creep.memory.isInPosition && !creep.spawning && creep.ticksToLive < 800) { // When spawning, apparently ticksToLive is 0
            creep.memory.renewing = true;
            creep.say('renew');
        } else if (creep.memory.dispensing && !creep.carryLevel) {
            resume(creep, target);
        } else if (!creep.memory.dispensing && (creep.availableCarryCapacity === 0 || creep.carryLevel && !target)) {
            creep.memory.dispensing = true;
            creep.say('dispense');
        }

        if (creep.memory.renewing) {
            creep.moveTo(creep.spawn);
        } else if (creep.memory.dispensing) {
            let carryingNonEnergy = creep.carryLevel !== creep.carry.energy;

            let destination = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity > creep.carryLevel ||
                        s.my && (s.structureType === STRUCTURE_STORAGE && s.availableResourceCapacity > 0 ||
                        !carryingNonEnergy && s.structureType === STRUCTURE_SPAWN && s.availableResourceCapacity >= creep.carry.energy);
                }
            });

            if (creep.pos.isNearTo(destination)) {
                for (let resource in creep.carry) {
                    creep.transfer(destination, resource);
                }
            } else {
                creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (target) {
            creep.memory.isInPosition = false;

            if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (!creep.memory.isInPosition) {
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].posts.scavenger);
        }
    }
};