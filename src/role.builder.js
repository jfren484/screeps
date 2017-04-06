/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function(creep) {
        let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        let target;

        if (!creep.memory.renewing && !creep.spawning && creep.ticksToLive < 200) { // When spawning, apparently ticksToLive is 0
            creep.memory.building = false;
            creep.memory.repairing = false;
            creep.memory.renewing = true;
            creep.say('renew');
        } else if (creep.memory.renewing && (creep.ticksToLive >= gameData.renewThreshold || creep.room.energyAvailable < 50)) {
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
            let toRepair = creep.room.getRepairTargets();

            if (toRepair.length) {
                toRepair = _.sortBy(toRepair, function (s) {
                    let firstSort = s.structureType === STRUCTURE_RAMPART && s.hits < 1000
                        ? -10000
                        : s.structureType === STRUCTURE_CONTAINER
                            ? -5000
                            : 0;

                    return firstSort + creep.pos.getRangeTo(s);
                });

                target = toRepair[0];
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