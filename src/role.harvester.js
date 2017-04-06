/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function(creep) {
        if (creep.memory.renewing) {
            if (Game.spawns['Spawn1'].renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }

            if (creep.ticksToLive >= gameData.renewThreshold || creep.room.energyAvailable < 50) {
                creep.memory.renewing = false;
                creep.say('harvest');
            }
        } else if (!creep.memory.isInPosition) {
            creep.takeUnoccupiedPost(gameData.myRooms[creep.room.name].harvesterPosts);
        } else {
            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            
            if (!source.energy && source.ticksToRegeneration > 45) {
                creep.memory.isInPosition = false;
                creep.memory.renewing = true;
                creep.say('renew');
                if (creep.carry.energy) {
                    creep.drop(RESOURCE_ENERGY);
                }
            } else  {
                if (source.energy) {
                    creep.harvest(source);
                }

                if (creep.carry.energy) {
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) {
                        return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity;
                    }});            

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