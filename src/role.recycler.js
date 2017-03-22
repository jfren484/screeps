module.exports = {
    run: function(creep) {
        if (!creep.memory.resigned) {
            if (creep.carry.energy) {
                creep.drop(RESOURCE_ENERGY);
            }
            
            creep.memory.targetId = null;
            creep.memory.resigned = true;
            creep.say('bye!');
        }
        
        var spawn = creep.getTarget();

        if (!spawn) {
            spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if (spawn) {
                creep.targetId = spawn.id;
            }
        }
        
        if (spawn && spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
    }
};