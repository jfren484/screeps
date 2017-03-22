module.exports = {
    run: function() {
        for (var roomName in Game.rooms) {
            var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            
            for (var towerIndex in towers) {
                var tower = towers[towerIndex];
                // TODO: prioritize creeps that still have attack or heal parts
                var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if (target) {
                    tower.attack(target);
                } else {
                    var hurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c) { return c.hits < c.hitsMax; }});
                    
                    if (hurtCreep) {
                        tower.heal(hurtCreep);
                    }
                }
            }
        }
    }
};