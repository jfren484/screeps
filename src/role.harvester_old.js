var gameData = require('game.data');

module.exports = {
    run: function(creep) {
        if (creep.memory.collecting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.collecting = false;
            creep.say('dispense');
        } else if (!creep.memory.collecting && creep.carry.energy === 0) {
            creep.memory.collecting = true;
            creep.say('harvest');
        }
        
        var target = Game.getObjectById('58cc52894abb9ae86993937b');

        if (creep.memory.collecting) {
            // var source = /*creep.room.find(FIND_SOURCES)[1];*/ creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            var source = creep.id == '58cb62f78e5d48a81314151e' || creep.id == '58cb661a91b7951c047a1765'
                ? creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
                : Game.getObjectById('5873bbec11e3e4361b4d6c59');
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.id == '58cb62f78e5d48a81314151e' || creep.id == '58cb661a91b7951c047a1765' || target.availableCapacity() < creep.carry.energy) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if ((structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_EXTENSION
                        || structure.structureType === STRUCTURE_TOWER)
                        && structure.energy < structure.energyCapacity) {
                        return true;
                    }

                    return structure.structureType === STRUCTURE_CONTAINER
                        && _.sum(structure.store) < structure.storeCapacity;
                }
            });
            
            if (targets.length === 0) {
                return;
            }
            
            var towers = _.filter(targets, (structure) => structure.structureType === STRUCTURE_TOWER);
            var containersPriority = _.filter(targets, (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.pos.x === 16 && structure.pos.y === 17);
            var containers = _.filter(targets, (structure) => structure.structureType === STRUCTURE_CONTAINER);
            var extensions = _.filter(targets, (structure) => structure.structureType === STRUCTURE_EXTENSION);
            var spawns = _.filter(targets, (structure) => structure.structureType === STRUCTURE_SPAWN);
            
            target = spawns.length ? spawns[0] : extensions.length ? extensions[0] : towers.length ? towers[0] : containersPriority.length ? containersPriority[0] : containers.length ? containers[0] : targets[0];
            
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);            
            if (target && target.pos == creep.pos) {
                creep.pickup(target);
            }
        } else {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};