var gameData = require('game.data');

module.exports = {
    run: function(creep) {
        if (!creep.memory.renewing && !creep.spawning && creep.ticksToLive < 200) { // When spawning, apparently ticksToLive is 0
            creep.memory.upgrading = false;
            creep.memory.renewing = true;
            creep.say('renew');
        } else if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('load');
        } else if (creep.memory.renewing && (creep.ticksToLive >= 1450 || Game.spawns['Spawn1'].energy < 50)) {
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
                creep.takeUnoccupiedPost(gameData.rooms[creep.room.name].upgraderPosts);
            }
        } else if (creep.memory.renewing) {
            creep.moveTo(Game.spawns['Spawn1']);
            if (!Game.spawns['Spawn1'].energy && creep.energy) {
                creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY);
            }
        } else {
            var containers = _.filter(creep.room.lookForAt(LOOK_STRUCTURES, gameData.rooms[creep.room.name].upgraderContainerPosition.x, gameData.rooms[creep.room.name].upgraderContainerPosition.y),
                (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0);
            
            if (!containers.length) {
                containers = _.sortBy(creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
                }}), function(c) {
                    return creep.pos.getRangeTo(c);
                });
            }
            
            if (containers.length) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};