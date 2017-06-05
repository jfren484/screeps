/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

function defaultShouldRenew(creep) {
    return creep.ticksToLive < gameData.renewThresholds.defaultRenew;
}

function renew(creep, renewCustomAction) {
    creep.say('renew');

    creep.memory.originalRole = creep.memory.role;
    creep.memory.role = 'renewer';

    if (renewCustomAction) {
        renewCustomAction(creep);
    }
}

module.exports = {
    renew: renew,
    renewCheck: function (creep, customShouldRenew, renewCustomAction) {
        let shouldRenew = customShouldRenew || defaultShouldRenew;
        if (!creep.spawn || !shouldRenew(creep)) {
            return false;
        }

        renew(creep, renewCustomAction);

        return true;
    },
    run: function (creep) {
        if (!creep.pos.isNearTo(creep.spawn)) {
            creep.moveTo(creep.spawn);
        } else if (creep.spawn.availableResourceCapacity && creep.carry.energy) {
            creep.transfer(creep.spawn, RESOURCE_ENERGY);
        }

        if (creep.ticksToLive > gameData.renewThresholds.complete || creep.room.energyAvailable < gameData.renewThresholds.lowEnergyAbort ||
            gameData.creepRoles[creep.memory.originalRole].isRenewComplete && gameData.creepRoles[creep.memory.originalRole].isRenewComplete(creep)) {
            creep.say(creep.memory.action);
            creep.memory.role = creep.memory.originalRole;
        }
    }
};