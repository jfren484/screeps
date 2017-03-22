var roleHarvesterOld = require('role.harvester_old');
var gameData = require('game.data');

var roleModules = {};
for (var roleName in gameData.creepRoles) {
    roleModules[roleName] = require('role.' + roleName);
}

module.exports = {
    run: function(room) {
        var spawn = Game.spawns['Spawn1'];
        
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                console.log('R.I.P.', Memory.creeps[name].role, name);
                delete Memory.creeps[name];
            }
        }
        
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester' && creep.getActiveBodyparts(WORK) < 3) {
                roleHarvesterOld.run(creep);
            } else {
                roleModules[creep.memory.role].run(creep);
            }
        }
    }
};