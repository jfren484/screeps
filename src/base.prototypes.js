/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

Creep.prototype.getTarget = function () {
    let target = null;

    if (this.memory.targetId) {
        target = Game.getObjectById(this.memory.targetId);

        if (!target) {
            this.memory.targetId = null;
        }
    }

    return target;
};

Creep.prototype.takeUnoccupiedPost = function (postPosArray) {
    for (let i = 0; i < postPosArray.length; ++i) {
        let post = postPosArray[i];

        if (this.pos.x === post.x && this.pos.y === post.y) {
            this.memory.isInPosition = true;
            return OK;
        } else if (!this.room.lookForAt(LOOK_CREEPS, post.x, post.y).length) {
            this.moveTo(post.x, post.y, {visualizePathStyle: {stroke: '#5D80B2'}});
            return OK;
        }
    }

    return ERR_NO_PATH;
};

Room.prototype.getRepairTargets = function () {
    return this.find(FIND_STRUCTURES, {
        filter: function (s) {
            return (s.structureType === STRUCTURE_WALL && s.hits < 75000)
                || (s.structureType === STRUCTURE_RAMPART && s.hits < 75000)
                || (s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax * 0.9)
                || (s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax * 0.96)
                || (s.structureType === STRUCTURE_TOWER && s.hits < s.hitsMax)
                || (s.structureType === STRUCTURE_EXTENSION && s.hits < s.hitsMax)
                || (s.structureType === STRUCTURE_STORAGE && s.hits < s.hitsMax);
        }
    });
};

Room.prototype.stats = function () {
    const width = 20;

    let creepStats = Object
        .keys(gameData.creepRoles)
        .sort()
        .map(function (roleName) {
            let creeps = _.filter(Game.creeps, (c) => c.memory.role === roleName);
            let count = creeps.length;
            let names = creeps.map(function (c) {
                return c.name;
            });
            let pad = ' '.repeat(width - roleName.length);
            return roleName.charAt(0).toUpperCase() + roleName.slice(1) + ':' + pad + count + ' (' + names.join(', ') + ')';
        })
        .join('\n');

    let repairTargets = this.getRepairTargets();
    let repairs = {};
    for (let i = 0; i < repairTargets.length; ++i) {
        let repairTarget = repairTargets[i];
        if (!repairs[repairTarget.structureType]) {
            repairs[repairTarget.structureType] = [];
        }
        repairs[repairTarget.structureType].push(repairTarget);
    }

    let repairStats = Object
        .keys(repairs)
        .sort()
        .map(function (structureType) {
            let count = repairs[structureType].length;

            let pad = ' '.repeat(width - structureType.length);
            return structureType.charAt(0).toUpperCase() + structureType.slice(1) + ':' + pad + count;
        })
        .join('\n')
        || 'None';

    return `Creeps:\n${creepStats}\n\nRepairs:\n${repairStats}`;
};

Spawn.prototype.renewMyAdjacentCreeps = function () {
    let spawn = this;

    if (spawn.energy >= 50) {
        spawn.room
            .lookForAtArea(LOOK_CREEPS, spawn.pos.y - 1, spawn.pos.x - 1, spawn.pos.y + 1, spawn.pos.x + 1, true)
            .map(function (found) {
                return found.creep;
            })
            .filter(function (creep) {
                return creep.my && creep.ticksToLive < 1450;
            })
            .forEach(function (creep) {
                spawn.renewCreep(creep);
            });
    }
};

Spawn.prototype.createCreepWithRole = function (roleName, creepName) {
    let creepRole = gameData.creepRoles[roleName];

    return this.createCreep(creepRole.body, creepName, {role: roleName, createdOn: new Date()});
};

Spawn.prototype.spawnNewCreeps = function () {
    let spawn = this;

    if (spawn.spawning) {
        let role = Game.creeps[spawn.spawning.name].memory.role;
        spawn.room.visual.text(`Spawning ${role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});

        return;
    }

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
};

StructureContainer.prototype.availableCapacity = function () {
    return this.storeCapacity - _.sum(this.store);
};