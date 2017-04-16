/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

function onRenew(creep) {
    creep.memory.action = gameData.constants.ACTION_HARVESTING;

    if (creep.carry.energy) {
        creep.drop(RESOURCE_ENERGY);
    }
}

module.exports = {
    run: function (creep) {
        if (renewer.renewCheck(creep, null, onRenew)) {
            return;
        }

        if (creep.takeUnoccupiedPost() === gameData.constants.RESULT_AT_POST) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES);

            if (!source.energy && source.ticksToRegeneration > 45) {
                renewer.renew(creep, onRenew);
            } else {
                if (source.energy) {
                    creep.harvest(source);
                }

                if (creep.carry.energy) {
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: function (s) {
                            return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity;
                        }
                    });

                    if (target) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    }
                }

                if (creep.carry.energy < creep.carryCapacity) {
                    let dropped = creep.pos.lookFor(LOOK_ENERGY);
                    if (dropped.length) {
                        creep.pickup(dropped[0]);
                    }
                }
            }
        }
    }
};