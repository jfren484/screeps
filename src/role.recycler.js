module.exports = {
    run: function(creep) {
        if (!creep.memory.resigned) {
            creep.memory.targetId = null;
            creep.memory.resigned = true;
            creep.say('bye!');
        }
        
        let spawn = creep.getTarget();

        if (!spawn) {
            spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if (spawn) {
                creep.targetId = spawn.id;
            }
        }

        if (!spawn) {
            return;
        }

        let result = spawn.recycleCreep(creep);
        
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        } else if (creep.carry.energy) {
            creep.transfer(spawn, RESOURCE_ENERGY);
            creep.drop(RESOURCE_ENERGY);
        }
    }
};