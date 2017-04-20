/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

function renewMyAdjacentCreeps(spawn) {
    if (spawn.room.energyAvailable >= 50) {
        spawn.room
            .lookForAtArea(LOOK_CREEPS, spawn.pos.y - 1, spawn.pos.x - 1, spawn.pos.y + 1, spawn.pos.x + 1, true)
            .map(function (found) {
                return found.creep;
            })
            .filter(function (creep) {
                return creep.my && creep.ticksToLive < gameData.renewThresholds.complete && creep.memory.role !== 'recycler';
            })
            .forEach(function (creep) {
                spawn.renewCreep(creep);
            });
    }
}

function spawnNewCreeps(spawn) {
    let i = 0;
    let roomCreepCounts = _.map(gameData.creepRoles, function (roleData, roleName) {
        const roleCreeps = _.filter(spawn.room.myCreeps, (creep) => creep.memory.role === roleName || creep.memory.role === 'renewer' && creep.memory.originalRole === roleName);
        const count = roleCreeps.length;
        const optimalCount = _.isFunction(gameData.creepRoles[roleName].optimalCount)
            ? gameData.creepRoles[roleName].optimalCount(spawn.room, gameData.myRooms[spawn.room.name].posts[roleName])
            : gameData.creepRoles[roleName].optimalCount || 0;

        return {
            role: roleName,
            index: i++,
            creeps: roleCreeps,
            creepsNeeded: optimalCount > count ? count - optimalCount : 0 // Make creepsNeeded negative for sorting
        };
    });

    let creepsNeeded = _.filter(roomCreepCounts, (data) => data.creepsNeeded !== 0);

    if (creepsNeeded.length) {
        let topNeed = _.sortBy(creepsNeeded, ['creepsNeeded', 'index'])[0];

        // TODO: naming convention
        spawn.createCreepWithRole(topNeed.role);
    } else {
        // TODO: any need to be recycled?
    }
}

module.exports = {
    run: function () {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

            renewMyAdjacentCreeps(spawn);

            if (spawn.spawning) {
                let role = Game.creeps[spawn.spawning.name].memory.role;
                spawn.room.visual.text(`Spawning ${role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
            } else {
                spawnNewCreeps(spawn);
            }
        }
    }
};