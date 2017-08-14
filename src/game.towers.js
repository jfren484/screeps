module.exports = {
    run: function() {
        for (let roomName in Game.rooms) {
            let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

            for (let towerIndex in towers) {
                let tower = towers[towerIndex];

                // Not sure why, but as of 8/14, sometimes tower doesn't contain a pos ?!
                if (!tower.pos) continue;

                // TODO: prioritize creeps that still have attack or heal parts
                let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if (target) {
                    tower.attack(target);
                } else {
                    let hurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c) { return c.hits < c.hitsMax; }});
                    
                    if (hurtCreep) {
                        tower.heal(hurtCreep);
                    }
                }
            }
        }
    }
};
