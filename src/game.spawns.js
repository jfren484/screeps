module.exports = {
    run: function() {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

        	spawn.renewMyAdjacentCreeps();

        	if (spawnName === 'Spawn1') {
                spawn.spawnNewCreeps();
            }
        }
    }
};