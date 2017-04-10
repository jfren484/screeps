let gameData = require('game.data');

function renewMyAdjacentCreeps(spawn) {
    if (spawn.room.energyAvailable >= 50) {
        spawn.room
            .lookForAtArea(LOOK_CREEPS, spawn.pos.y - 1, spawn.pos.x - 1, spawn.pos.y + 1, spawn.pos.x + 1, true)
            .map(function (found) {
                return found.creep;
            })
            .filter(function (creep) {
                return creep.my && creep.ticksToLive < gameData.renewThreshold;
            })
            .forEach(function (creep) {
                spawn.renewCreep(creep);
            });
    }
}

function spawnNewCreeps(spawn) {
    for (let roleName in gameData.creepRoles) {
        let creepRole = gameData.creepRoles[roleName];
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === roleName);

        if (creeps.length >= creepRole.optimalCount) {
            continue;
        }

        let result = spawn.canCreateCreep(creepRole.body);
        if (result === OK) {
            let newName = spawn.createCreepWithRole(roleName, undefined);

            console.log(`Spawning new ${roleName}: ${newName}`);
        } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
            console.log(new Date() + ': canCreateCreep returned ' + result + ' for creep role ' + roleName);
        }

        return;
    }
}

module.exports = {
    run: function () {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

            renewMyAdjacentCreeps(spawn);

            if (spawnName === 'Spawn1') {
                if (spawn.spawning) {
                    let role = Game.creeps[spawn.spawning.name].memory.role;
                    spawn.room.visual.text(`Spawning ${role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});

                    return;
                }

                spawnNewCreeps(spawn);
            }
        }
    }
};