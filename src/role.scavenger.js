let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        let creepLoad = _.sum(creep.carry);

        if (creep.memory.dispensing && !creepLoad) {
            creep.memory.dispensing = false;
            if (target) {
                creep.say('scavenge');
            } else {
                creep.memory.isInPosition = false;
                creep.say('resting');
            }
        } else if (!creep.memory.dispensing && (!target && creepLoad || creepLoad === creep.carryCapacity)) {
            creep.memory.dispensing = true;
            creep.say('dispense');
        }

        if (creep.memory.dispensing) {
            let carryingNonEnergy = creepLoad != creep.carry.energy;

            let destination = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.availableCapacity() > 0 ||
                        s.my && (s.structureType === STRUCTURE_STORAGE && s.capacity > _.sum(s.store) ||
                        !carryingNonEnergy && s.structureType === STRUCTURE_SPAWN && s.energyCapacity > s.energy);
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
            if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (!creep.memory.isInPosition) {
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].scavengerPosts);
        }
    }
};