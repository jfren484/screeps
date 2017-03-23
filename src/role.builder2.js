let gameData = require('game.data');

function createThreshold(repair, emergency, full) {
    return {
        'repair':    repair,
        'emergency': emergency,
        'full':      full
    };
}

let structureThreshold = {};
structureThreshold[STRUCTURE_CONTAINER] = createThreshold(240000, 10000, 250000);
structureThreshold[STRUCTURE_RAMPART]   = createThreshold( 45000,  1000, 100000);
structureThreshold[STRUCTURE_ROAD]      = createThreshold(  4500,   500,   5000);
structureThreshold[STRUCTURE_WALL]      = createThreshold( 45000,  1000, 100000);

module.exports = {
    run: function(creep) {
        let target;

        if (creep.memory.refueling && creep.carry.energy === creep.carryCapacity) {
            creep.memory.refueling = false;
            creep.say('back to work');
        } else if (!creep.memory.refueling && creep.carry.energy === 0) {
            creep.memory.refueling = true;
            creep.say('refueling');
        }

        if (creep.memory.refueling) {
            let containers = creep.room.find(FIND_STRUCTURES, {filter: function(s) {
                return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
            }});

            if (containers.length) {
                containers = _.sortBy(containers, [function(c) { return creep.pos.getRangeTo(c); }]);
                
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            let target = creep.getTarget();
    
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
    
            let isConstructionSite = !!target.progressTotal;
            let action = isConstructionSite ?
                creep.build(target) :
                creep.repair(target);
            
            if (action === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (!isConstructionSite && target.hits >= structureThreshold[target.structureType].full) {
                creep.memory.targetId = null;
            }
        }
        
        // TODO: Get rid of old code below

        let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        if (creep.memory.repairing) {
            let toRepair = creep.room.find(FIND_STRUCTURES, {
                filter: function(struct) {
                    return (struct.structureType === STRUCTURE_WALL && struct.hits < 10000)
                        || (struct.structureType === STRUCTURE_RAMPART && struct.hits < 50000)
                        || (struct.structureType === STRUCTURE_ROAD && struct.hits < 4500)
                        || (struct.structureType === STRUCTURE_CONTAINER && struct.hits < 240000);
                }
            });
            if (toRepair.length) {
                let ramparts = _.filter(toRepair, (s) => s.structureType === STRUCTURE_RAMPART);
                target = ramparts.length ? ramparts[0] : toRepair[0];
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