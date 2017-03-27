/// <reference path="../scripts/_references.js" />
let roleHarvesterOld = require('role.harvester_old');
let gameData = require('game.data');

let roleModules = {};
for (let roleName in gameData.creepRoles) {
    roleModules[roleName] = require(`role.${roleName}`);
}

module.exports = {
    run: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                console.log(`R.I.P. ${Memory.creeps[name].role} ${name}`);
                delete Memory.creeps[name];
            }
        }
        
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            if (creep.memory.role === 'harvester' && creep.getActiveBodyparts(WORK) < 3) {
                roleHarvesterOld.run(creep);
            } else if (roleModules[creep.memory.role]) {
                roleModules[creep.memory.role].run(creep);
            } else {
                console.log('Unknown role: ' + creep.memory.role);
            }
        }
    }
};