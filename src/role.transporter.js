/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function(creep) {
        let target = creep.getTarget();
        
        if (creep.memory.collecting) {
            if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.collecting = false;
                target = null;
                creep.memory.targetId = null;
                creep.say('dispense');
            } else if (target && !target.energy && (!target.store || !target.store.energy)) {
                target = null;
                creep.memory.targetId = null;
                creep.say('switching');
            }
        } else if (creep.carry.energy === 0) {
            creep.memory.collecting = true;
            target = null;
            creep.memory.targetId = null;
            creep.say('collect');
        }

        if (creep.memory.collecting) {
            if (!target) {
                let containers = creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                    return s.structureType === STRUCTURE_CONTAINER && s.store.energy;
                }});
                
                if (containers.length) {
                    containers = _.sortBy(containers, function(c) {
                        let bucket300 = -Math.round(c.store.energy / 300) * 300;
                        return bucket300 + creep.pos.getRangeTo(c);
                    });
                    
                    target = containers[0];
                    creep.memory.targetId = target.id;
                } else {
                    creep.memory.collecting = false;
                }
            }

            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.memory.lastCollectedFromId = target.id;
                }
            }
        } else {
            if (!target) {
                let receivers = creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                    return s.id !== creep.memory.lastCollectedFromId
                        && (s.structureType === STRUCTURE_CONTAINER && s.availableCapacity() >= creep.carry.energy
                        || s.structureType === STRUCTURE_STORAGE && s.storeCapacity - _.sum(s.store) >= creep.carry.energy
                        || (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER)
                            && s.energyCapacity - s.energy > 0);
                }});
                
                if (receivers.length) {
                    receivers = _.sortBy(receivers, function(c) {
                        let sort = 0;
                        
                        if (c.structureType === STRUCTURE_SPAWN && c.energy < 200) {
                            sort = -1000;
                        }
                        
                        if (c.structureType === STRUCTURE_CONTAINER) {
                            sort += Math.round(c.store.energy / 500) * 500;
                        } else if (c.structureType === STRUCTURE_STORAGE) {
                            sort = 1200;
                        }

                        return sort + creep.pos.getRangeTo(c);
                    });
                    
                    target = receivers[0];
                    creep.memory.targetId = target.id;
                }
            }
            
            if (target) {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (result === ERR_FULL) {
                    creep.memory.targetId = null;
                }
            }
        }
    }
};