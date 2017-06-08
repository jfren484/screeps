/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function (creep) {
        if (renewer.renewCheck(creep, (c) => !c.carryLevel && c.ticksToLive < 500, (c) => c.memory.action = gameData.constants.ACTION_LOADING)) {
            return;
        }

        if (!creep.memory.active || !creep.source || !creep.destinationPos) {
            return;
        }

        let resourceType = creep.memory.resourceType || RESOURCE_ENERGY;

        if ((!creep.availableCarryCapacity || creep.carryLevel && !creep.source.store[resourceType]) && creep.is(gameData.constants.ACTION_LOADING)) {
            creep.memory.action = gameData.constants.ACTION_DISPENSING;
            creep.say(creep.memory.action);
        } else if (!creep.carryLevel && !creep.is(gameData.constants.ACTION_LOADING)) {
            creep.memory.action = gameData.constants.ACTION_LOADING;
            creep.say(creep.memory.action);
        }

        if (creep.is(gameData.constants.ACTION_LOADING)) {
            let result = creep.withdraw(creep.source, resourceType);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.is(gameData.constants.ACTION_DISPENSING)) {
            if (creep.room.name !== creep.destinationPos.roomName) {
                creep.moveTo(creep.destinationPos)
            } else {
                let target;

                if (creep.carryLevel > creep.carry.energy) {
                    target = creep.room.storage;
                } else {
                    let receivers = creep.room.find(FIND_STRUCTURES, {
                        filter: function (s) {
                            return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity
                                || s.structureType === STRUCTURE_STORAGE && s.availableResourceCapacity;
                        }
                    });

                    if (receivers.length) {
                        receivers = _.sortBy(receivers, function (s) {
                            let sort = 0;

                            if (s.structureType === STRUCTURE_CONTAINER) {
                                sort = s.store.energy < 1000 ? -1000 : 1000;
                            }

                            return sort + creep.pos.getRangeTo(s);
                        });

                        target = receivers[0];
                    }
                }

                if (target) {
                    if (creep.pos.isNearTo(target)) {
                        for (let resource in creep.carry) {
                            creep.transfer(target, resource);
                        }
                    } else {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};