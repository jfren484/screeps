module.exports = {
    run: function() {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

        	spawn.renewMyAdjacentCreeps();
    
        	spawn.spawnNewCreeps();
        // 	spawn.spawnNewCreeps_old();
        }
    }
};