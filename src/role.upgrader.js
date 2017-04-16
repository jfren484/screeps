/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function(creep) {
        if (renewer.renewCheck(creep, null, (c) => c.memory.action = gameData.constants.ACTION_LOADING)) {
            return;
        }

        if (creep.is(gameData.constants.ACTION_UPGRADING) && !creep.carry.energy) {
            creep.memory.action = gameData.constants.ACTION_LOADING;
            creep.say(creep.memory.action);
        } else if (creep.is(gameData.constants.ACTION_LOADING) && !creep.availableCarryCapacity) {
            creep.memory.action = gameData.constants.ACTION_UPGRADING;
            creep.say(creep.memory.action);
        }

        if (!creep.is(gameData.constants.ACTION_UPGRADING)) {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.store.energy > 0;
                }
            });

            if (containers.length) {
                let container = _.sortBy(containers, function (c) {
                    return creep.pos.getRangeTo(c);
                })[0];

                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else if (creep.takeUnoccupiedPost() === gameData.constants.RESULT_AT_POST) {
            creep.upgradeController(creep.room.controller);
        }
    }
};