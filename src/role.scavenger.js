/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function (creep) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function (r) {
                return r.amount >= r.pos.getRangeTo(creep) && !r.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length;
            }
        });

        if (renewer.renewCheck(creep,
                function (creep) {
                    if (creep.ticksToLive < gameData.renewThresholds.defaultRenew) {
                        return true;
                    }

                    return creep.ticksToLive > 750 && !target;
                },
                function (creep) {
                    creep.memory.action = gameData.constants.ACTION_LOADING;
                })
        ) {
            return;
        }

        if (creep.is(gameData.constants.ACTION_DISPENSING) && !creep.carryLevel) {
            creep.memory.action = gameData.constants.ACTION_LOADING;
            creep.say(creep.memory.action);
        } else if (!creep.is(gameData.constants.ACTION_DISPENSING) && (creep.availableCarryCapacity === 0 || creep.carryLevel && !target)) {
            creep.memory.action = gameData.constants.ACTION_DISPENSING;
            creep.say(creep.memory.action);
        }

        if (creep.is(gameData.constants.ACTION_DISPENSING)) {
            let carryingNonEnergy = creep.carryLevel !== creep.carry.energy;

            let destination = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity > creep.carryLevel ||
                        s.my && (s.structureType === STRUCTURE_STORAGE && s.availableResourceCapacity > 0 ||
                        !carryingNonEnergy && s.structureType === STRUCTURE_SPAWN && s.availableResourceCapacity >= creep.carry.energy);
                }
            });

            if (creep.pos.isNearTo(destination)) {
                for (let resource in creep.carry) {
                    creep.transfer(destination, resource);
                }
            } else {
                creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (target) {
            if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.takeUnoccupiedPost();
        }
    }
};