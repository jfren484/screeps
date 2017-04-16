/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function (creep) {
        if (renewer.renewCheck(creep, null, (c) => c.memory.action = gameData.constants.ACTION_LOADING)) {
            return;
        }

        if (creep.is(gameData.constants.ACTION_BUILDING, gameData.constants.ACTION_REPAIRING) && !creep.carry.energy) {
            creep.memory.action = gameData.constants.ACTION_LOADING;
            creep.say(creep.memory.action);
        }

        if (creep.is(gameData.constants.ACTION_BUILDING)) {
            const buildTargets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

            if (!buildTargets.length) {
                creep.memory.action = gameData.constants.ACTION_REPAIRING;
                creep.say(creep.memory.action);
            } else {
                let priorityTargets = _.filter(buildTargets, (s) => s.structureType === STRUCTURE_EXTENSION);
                if (!priorityTargets.length) {
                    priorityTargets = _.filter(buildTargets, (s) => s.structureType === STRUCTURE_ROAD);
                }
                if (!priorityTargets.length) {
                    priorityTargets = _.filter(buildTargets, (s) => s.structureType === STRUCTURE_CONTAINER);
                }
                if (!priorityTargets.length) {
                    priorityTargets = buildTargets;
                }

                if (priorityTargets.length > 1) {
                    priorityTargets = _.sortBy(priorityTargets, [function (t) {
                        return creep.pos.getRangeTo(t);
                    }]);
                }

                if (creep.build(priorityTargets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(priorityTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }

        if (creep.is(gameData.constants.ACTION_REPAIRING)) {
            let repairTargets = creep.room.getRepairTargets();

            if (repairTargets.length) {
                repairTargets = _.sortBy(repairTargets, function (s) {
                    let firstSort = s.structureType === STRUCTURE_RAMPART && s.hits < 1000
                        ? -10000
                        : s.structureType === STRUCTURE_CONTAINER
                            ? -5000
                            : 0;

                    return firstSort + creep.pos.getRangeTo(s);
                });

                if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.action = gameData.constants.ACTION_LOADING;
                creep.say(creep.memory.action);
            }
        }

        if (creep.is(gameData.constants.ACTION_LOADING)) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.store.energy;
                }
            });

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

            if (!creep.availableCarryCapacity) {
                creep.memory.action = gameData.constants.ACTION_BUILDING;
                creep.say(creep.memory.action);
            }
        }
    }
};