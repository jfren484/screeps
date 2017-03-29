/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        let attackPosition = Game.flags['Attack Position'];

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
        } else if (!creep.memory.isMovingToAttack && attackPosition && attackPosition.roomName != creep.room.name) {
            creep.memory.isMovingToAttack = true;
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