module.exports = {
    run: function (creep) {
        if (!creep.spawn) {
            return;
        }

        if (!creep.pos.isNearTo(creep.spawn)) {
            creep.moveTo(creep.spawn);
        } else if (creep.carry.energy) {
            creep.transfer(creep.spawn, RESOURCE_ENERGY);
            creep.drop(RESOURCE_ENERGY);
        } else {
            creep.say('bye!');
            creep.spawn.recycleCreep(creep);
        }
    }
};