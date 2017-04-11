/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        let attackPosition = Game.flags['Attack'];

        if (creep.memory.isMovingToAttack && attackPosition && creep.pos.getRangeTo(attackPosition) < 2) {
            creep.memory.isMovingToAttack = false;
            creep.memory.isAttacking = true;
        }

        if (creep.memory.isMovingToAttack && !creep.memory.renewing) {
            creep.moveTo(attackPosition);
        } else if (creep.memory.isAttacking) {
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
                creep.moveTo(attackPosition);
            }
        } else if (!creep.memory.isMovingToAttack && attackPosition && attackPosition.roomName !== creep.room.name) {
            creep.memory.isMovingToAttack = true;
            creep.memory.isInPosition = false;
            creep.memory.renewing = true;
        } else if (creep.memory.renewing) {
            if (creep.spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.spawn);
            }

            if (creep.ticksToLive >= gameData.renewThreshold) {
                creep.memory.renewing = false;
                creep.say('form up');
            }
        } else if (!creep.memory.isInPosition) {
            if (gameData.myRooms[creep.room.name] && gameData.myRooms[creep.room.name].posts.infantry) {
                creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].posts.infantry);
            } else {
                creep.moveTo(Game.flags['Home']);
            }
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].posts.infantry);
        } else if (creep.ticksToLive < 200) {
            creep.memory.isInPosition = false;
            creep.memory.renewing = true;
            creep.say('renew');
        }
    }
};