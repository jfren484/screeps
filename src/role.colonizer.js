/// <reference path="../scripts/_references.js" />

function isColonizing(creep) {
    if (!creep.memory.colonizing) {
        let claimFlag = Game.flags['Claim'];
        if (!claimFlag) return;

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
        if (!isColonizing(creep)) return;

        let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        let buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        const harvesting = creep.memory.action === 'harvest';
        const upgrading = creep.memory.action === 'upgrade';
        const building = creep.memory.action === 'build';
        const renewing = creep.memory.action === 'renew';

        if (!renewing && !creep.spawning && creep.ticksToLive < 100) { // When spawning, apparently ticksToLive is 0
            if (spawn) {
                creep.memory.action = 'renew';
                creep.say(creep.memory.action);
            } else {
                creep.memory.action = 'upgrade';
                creep.say(creep.memory.action);
            }
        } else if ((upgrading || building) && creep.carry.energy === 0
            || upgrading && buildTarget && creep.ticksToLive > 100
            || building && !buildTarget
            || renewing && (creep.ticksToLive >= 1450 || creep.room.energyAvailable < 50)) {
            creep.memory.action = 'harvest';
            creep.say(creep.memory.action);
        } else if (harvesting && creep.carry.energy === creep.carryCapacity) {
            if (buildTarget) {
                creep.memory.action = 'build';
                creep.say(creep.memory.action);
            } else {
                creep.memory.action = 'upgrade';
                creep.say(creep.memory.action);
            }
        }

        if (harvesting) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else if (upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (building) {
            if (creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (renewing) {
            creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
            if (!creep.room.energyAvailable && creep.energy) {
                creep.transfer(spawn, RESOURCE_ENERGY);
            }
        } else {
            creep.say('help!');
        }
    }
};