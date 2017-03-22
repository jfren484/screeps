var gameData = require('game.data');

module.exports = {
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        if (creep.memory.dispensing && creep.carry.energy === 0) {
            creep.memory.dispensing = false;
            if (target) {
                creep.say('scavenge');
            } else {
                creep.say('resting');
            }
        } else if (!creep.memory.dispensing && (!target && creep.carry.energy || creep.carry.energy === creep.carryCapacity)) {
            creep.memory.dispensing = true;
            creep.say('dispense');
        }
        
        if (creep.memory.dispensing) {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) {
                return s.structureType === STRUCTURE_CONTAINER && s.availableCapacity() > 0;
            }}) || creep.pos.findClosestByRange(FIND_MY_SPAWNS);

            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (target) {
            if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (creep.pos.x !== 16 || creep.pos.y !== 28) {
            creep.moveTo(16, 28, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};