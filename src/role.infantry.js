/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        let roomData = gameData.myRooms[creep.room.name];

        if (creep.memory.isMovingToAttack && creep.pos.getRangeTo(creep.memory.attackPosition) < 2) {
            creep.memory.isMovingToAttack = false;
            creep.memory.isAttacking = true;
            creep.memory.targetId = null;
        }

        if (creep.memory.isMovingToAttack && !creep.memory.renewing) {
            creep.moveTo(creep.memory.attackPosition);
        } else if (creep.memory.isAttacking) {
            let target = creep.getTarget();

            if (!target) {
                target = creep.findClosestByRange(FIND_HOSTILE_CREEPS)
                    || creep.findClosestByRange(FIND_STRUCTURES, {
                        filter: function (s) {
                            return !s.my && s.structureType === STRUCTURE_SPAWN;
                        }
                    })
                    || creep.findClosestByRange(FIND_STRUCTURES, {
                        filter: function (s) {
                            return !s.my && s.structureType === STRUCTURE_EXTENSION;
                        }
                    });
            }

            if (target) {
                creep.memory.targetId = target.id;

                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.moveTo(creep.memory.attackPosition);
            }
        } else if (roomData && roomData.targetPosition && roomData.targetPosition.roomName != creep.room.name) {
            creep.memory.isMovingToAttack = true;
            creep.memory.attackPosition = roomData.targetPosition;
            creep.memory.isInPosition = false;
            creep.memory.renewing = true;
        } else if (creep.memory.renewing) {
            if (Game.spawns['Spawn1'].renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }

            if (creep.ticksToLive >= 1450) {
                creep.memory.renewing = false;
                creep.say('form up');
            }
        } else if (!creep.memory.isInPosition) {
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].soldierPosts);
        } else if (creep.ticksToLive < 200) {
            creep.memory.isInPosition = false;
            creep.memory.renewing = true;
            creep.say('renew');
        }
    }
};