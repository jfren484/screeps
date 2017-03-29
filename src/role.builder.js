/// <reference path="../scripts/_references.js" />
module.exports = {
    run: function(creep) {
        let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        let target;

        if (!creep.memory.renewing && !creep.spawning && creep.ticksToLive < 200) { // When spawning, apparently ticksToLive is 0
            creep.memory.building = false;
            creep.memory.repairing = false;
            creep.memory.renewing = true;
            creep.say('renew');
        } else if (creep.memory.renewing && (creep.ticksToLive >= 1450 || creep.room.energyAvailable < 50)) {
            creep.memory.renewing = false;
            creep.say('load');
        } else if ((creep.memory.building || creep.memory.repairing) && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.memory.repairing = false;
            creep.say('load');
        } else if (!creep.memory.building && !creep.memory.repairing && creep.carry.energy === creep.carryCapacity) {
            if (targets.length) {
                creep.memory.building = true;
                creep.say('build');
            } else {
                creep.memory.repairing = true;
                creep.say('repair');
            }
        }

        if (creep.memory.building) {
            if (targets.length) {
                let priorityTargets = _.filter(targets, (s) => s.structureType === STRUCTURE_EXTENSION);
                if (!priorityTargets.length) {
                    priorityTargets = _.filter(targets, (s) => s.structureType === STRUCTURE_ROAD);
                }
                if (!priorityTargets.length) {
                    priorityTargets = _.filter(targets, (s) => s.structureType === STRUCTURE_CONTAINER);
                }
                if (!priorityTargets.length) {
                    priorityTargets = targets;
                }
                
                if (priorityTargets.length > 1) {
                    priorityTargets = _.sortBy(priorityTargets, [function(t) { return creep.pos.getRangeTo(t); }]);
                }
                
                target = priorityTargets[0];
                
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.building = false;
                creep.memory.repairing = true;
            }
        } else if (creep.memory.repairing) {
            let toRepair = creep.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return (s.structureType === STRUCTURE_WALL && s.hits < 50000)
                        || (s.structureType === STRUCTURE_RAMPART && s.hits < 50000)
                        || (s.structureType === STRUCTURE_ROAD && s.hits < 4500)
                        || (s.structureType === STRUCTURE_CONTAINER && s.hits < 240000)
                        || (s.structureType === STRUCTURE_TOWER && s.hits < s.hitsMax)
                        || (s.structureType === STRUCTURE_EXTENSION && s.hits < s.hitsMax)
                        || (s.structureType === STRUCTURE_STORAGE && s.hits < s.hitsMax);
                }
            });
            if (toRepair.length) {
                let ramparts = _.filter(toRepair, (s) => s.structureType === STRUCTURE_RAMPART);
                target = ramparts.length ? ramparts[0] : toRepair[0];
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.repairing = false;
                creep.memory.building = true;
            }
        } else if (creep.memory.renewing) {
            creep.moveTo(Game.spawns['Spawn1']);
            if (!creep.room.energyAvailable && creep.energy) {
                creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY);
            }
        } else {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) {
                return s.structureType === STRUCTURE_CONTAINER && s.store.energy;
            }});

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};