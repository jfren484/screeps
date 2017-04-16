/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function (creep) {
        if (renewer.renewCheck(creep, null, (c) => c.memory.action = gameData.constants.ACTION_ATTACKING)) {
            return;
        }

        if (!creep.is(gameData.constants.ACTION_TRAVELING) && creep.memory.destinationFlag) {
            renewer.renew(creep, (c) => c.memory.action = gameData.constants.ACTION_TRAVELING);
        }

        // TODO: Make traveler its own role
        if (creep.is(gameData.constants.ACTION_TRAVELING)) {
            const destinationFlag = Game.flags[creep.memory.destinationFlag];

            if (creep.pos.isNearTo(destinationFlag)) {
                creep.memory.destinationFlag = null;
                creep.memory.action = gameData.constants.ACTION_ATTACKING;
                creep.say(creep.memory.action);
            } else {
                creep.moveTo(destinationFlag);
            }
        }

        if (creep.is(gameData.constants.ACTION_ATTACKING)) {
            // TODO: handle targets behind walls, etc.
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
                || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function (s) {
                        return !s.my && s.structureType === STRUCTURE_SPAWN;
                    }
                })
                || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function (s) {
                        return !s.my && s.structureType === STRUCTURE_EXTENSION;
                    }
                });

            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.takeUnoccupiedPost();
            }
        }
    }
};