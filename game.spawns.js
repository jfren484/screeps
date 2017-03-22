module.exports = {
    run: function(room) {
        for (var spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName];

        	spawn.renewMyAdjacentCreeps();
    
        	spawn.spawnNewCreeps();
        // 	spawn.spawnNewCreeps_old();
        }
    }
};