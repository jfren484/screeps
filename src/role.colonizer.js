/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

function isColonizing(creep) {
    if (!creep.memory.colonizing) {
        let claimFlag = Game.flags['Claim'];
        if (!claimFlag) return false;

        if (creep.pos.getRangeTo(claimFlag) < 2) {
            creep.memory.action = 'harvest';
            creep.memory.colonizing = true;
        } else {
            creep.moveTo(claimFlag, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    return creep.memory.colonizing;
}

module.exports = {
    run: function (creep) {
        // TODO: renewer functionality

        if (!isColonizing(creep)) return;

        let buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        let repairTargets = creep.room.getRepairTargets();
        let repairTarget = repairTargets.length ? repairTargets[0] : null;
        let dispenseTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
            {
                filter: function (s) {
                    return s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity;
                }
            });

        const renewing = creep.memory.action === 'renew';

        if (!renewing && creep.ticksToLive < 100) {
            if (creep.spawn) {
                creep.memory.action = 'renew';
                creep.say(creep.memory.action);
            } else {
                creep.memory.action = 'upgrade';
                creep.say(creep.memory.action);
            }
        } else if ((creep.is(gameData.constants.ACTION_UPGRADING) || creep.is(gameData.constants.ACTION_BUILDING) || creep.is(gameData.constants.ACTION_REPAIRING) ||
            creep.is(gameData.constants.ACTION_DISPENSING)) && !creep.carry.energy ||
            creep.is(gameData.constants.ACTION_UPGRADING) && buildTarget && creep.ticksToLive > 100 ||
            creep.is(gameData.constants.ACTION_BUILDING) && !buildTarget ||
            creep.is(gameData.constants.ACTION_REPAIRING) && !repairTarget ||
            creep.is(gameData.constants.ACTION_DISPENSING) && !dispenseTarget ||
            renewing && (creep.ticksToLive >= gameData.renewThresholds.complete || creep.room.energyAvailable < 50)) {
            creep.memory.action = gameData.constants.ACTION_HARVESTING;
            creep.say(creep.memory.action);
        } else if (creep.is(gameData.constants.ACTION_HARVESTING) && !creep.availableCarryCapacity) {
            if (dispenseTarget) {
                creep.memory.action = gameData.constants.ACTION_DISPENSING;
                creep.say(creep.memory.action);
            } else if (buildTarget) {
                creep.memory.action = gameData.constants.ACTION_BUILDING;
                creep.say(creep.memory.action);
            } else if (repairTarget) {
                creep.memory.action = gameData.constants.ACTION_REPAIRING;
                creep.say(creep.memory.action);
            } else {
                creep.memory.action = gameData.constants.ACTION_UPGRADING;
                creep.say(creep.memory.action);
            }
        }

        if (creep.is(gameData.constants.ACTION_HARVESTING)) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else if (creep.is(gameData.constants.ACTION_UPGRADING)) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (creep.is(gameData.constants.ACTION_BUILDING)) {
            if (creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (creep.is(gameData.constants.ACTION_REPAIRING)) {
            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (renewing) {
            creep.moveTo(creep.spawn, {visualizePathStyle: {stroke: '#ffffff'}});
            if (creep.room.energyAvailable < 100 && creep.energy) {
                creep.transfer(creep.spawn, RESOURCE_ENERGY);
            }
        } else if (creep.is(gameData.constants.ACTION_DISPENSING)) {
            if (creep.transfer(dispenseTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(dispenseTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.say('zzzz');
        }
    }
};