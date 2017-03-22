var gameData = require('game.data');

function createThreshhold(repair, emergency, full) {
    return {
        'repair':    repair,
        'emergency': emergency,
        'full':      full
    };
}

var structureThreshhold = {};
structureThreshhold[STRUCTURE_CONTAINER] = createThreshhold(240000, 10000, 250000);
structureThreshhold[STRUCTURE_RAMPART]   = createThreshhold( 45000,  1000,  50000);
structureThreshhold[STRUCTURE_ROAD]      = createThreshhold(  4500,   500,   5000);
structureThreshhold[STRUCTURE_WALL]      = createThreshhold( 45000,  1000,  50000);

module.exports = {
    run: function(creep) {
        if (creep.memory.refueling && creep.carry.energy === creep.carryCapacity) {
            creep.memory.refueling = false;
            creep.say('back to work');
        } else if (!creep.memory.refueling && creep.carry.energy === 0) {
            creep.memory.refueling = true;
            creep.say('refueling');
        }

        if (creep.memory.refueling) {
            var containers = creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
            }});

            if (containers.length) {
                containers = _.sortBy(containers, [function(c) { return creep.pos.getRangeTo(c); }]);
                
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            var target = creap.getTarget();
    
            if (!target) {
                // TODO: find something else to do
                
                // TODO: check for any emergency repairs needed
                
                // TODO: check for any construction sites
                
                // TODO: check for low-priority repairs needed
    
                // Didn't find a target - exit function            
                if (!target) {
                    return;
                }
            }
    
            var isConstructionSite = !!target.progressTotal;
            var action = isConstructionSite ?
                creep.build(target) :
                creep.repair(target);
            
            if (action === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (!isConstructionSite && target.hits >= structureThreshhold[target.structureType].full) {
                creep.memory.targetId = null;
            }
        }
        
        // TODO: Get rid of old code below

        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        if (creep.memory.repairing) {
            var toRepair = creep.room.find(FIND_STRUCTURES, {
                filter: function(struct) {
                    return (struct.structureType === STRUCTURE_WALL && struct.hits < 10000)
                        || (struct.structureType === STRUCTURE_RAMPART && struct.hits < 50000)
                        || (struct.structureType === STRUCTURE_ROAD && struct.hits < 4500)
                        || (struct.structureType === STRUCTURE_CONTAINER && struct.hits < 240000);
                }
            });
            if (toRepair.length) {
                var ramparts = _.filter(toRepair, (s) => s.structureType === STRUCTURE_RAMPART);
                var target = ramparts.length ? ramparts[0] : toRepair[0];
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.repairing = false;
                creep.memory.building = true;
            }
        }
    }
};