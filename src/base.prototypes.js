/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

/* Creep */

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
        } else {
            let creepInPost = this.room.lookForAt(LOOK_CREEPS, post.x, post.y);
            if (!creepInPost.length || creepInPost[0].memory.role !== this.memory.role) {
                this.moveTo(post.x, post.y, {visualizePathStyle: {stroke: '#5D80B2'}});
                return OK;
            }
        }
    }

    return ERR_NO_PATH;
};

Object.defineProperty(Creep.prototype, 'carryLevel', {
    get: function() {
        if(this === Creep.prototype || this === undefined) return;

        return _.sum(this.carry);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'availableCarryCapacity', {
    get: function() {
        if(this === Creep.prototype || this === undefined) return;

        return this.carryCapacity - this.carryLevel;
    },
    enumerable: true,
    configurable: true
});

/* Room */

Room.prototype.getRepairTargets = function () {
    return this.find(FIND_STRUCTURES, {
        filter: function (s) {
            return (s.structureType === STRUCTURE_WALL && s.hits < 100000)
                || (s.structureType === STRUCTURE_RAMPART && s.hits < 100000)
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

/* Spawn */

Spawn.prototype.createCreepWithRole = function (roleName, creepName) {
    let creepRole = gameData.creepRoles[roleName];

    return this.createCreep(creepRole.body, creepName, {role: roleName, createdOn: new Date()});
};

/* Structure Resource Capacity */

Object.defineProperty(Structure.prototype, 'resourceLevel', {
    get: function() {
        if(this === Structure.prototype || this === undefined) return;

        return this.__get_resourceLevel();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Structure.prototype, 'resourceCapacity', {
    get: function() {
        if(this === Structure.prototype || this === undefined) return;

        return this.__get_resourceCapacity();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Structure.prototype, 'availableResourceCapacity', {
    get: function() {
        if(this === Structure.prototype || this === undefined) return;

        return this.__get_resourceCapacity() - this.__get_resourceLevel();
    },
    enumerable: true,
    configurable: true
});

// Override in specific structure classes
Structure.prototype.__get_resourceLevel = function () {
    return 0;
};
Structure.prototype.__get_resourceCapacity = function () {
    return 0;
};

StructureContainer.prototype.__get_resourceLevel = function () {
    return _.sum(this.store);
};
StructureContainer.prototype.__get_resourceCapacity = function () {
    return this.storeCapacity;
};

StructureExtension.prototype.__get_resourceLevel = function () {
    return this.energy;
};
StructureExtension.prototype.__get_resourceCapacity = function () {
    return this.energyCapacity;
};

StructureLink.prototype.__get_resourceLevel = function () {
    return this.energy;
};
StructureLink.prototype.__get_resourceCapacity = function () {
    return this.energyCapacity;
};

StructureSpawn.prototype.__get_resourceLevel = function () {
    return this.energy;
};
StructureSpawn.prototype.__get_resourceCapacity = function () {
    return this.energyCapacity;
};

StructureStorage.prototype.__get_resourceLevel = function () {
    return _.sum(this.store);
};
StructureStorage.prototype.__get_resourceCapacity = function () {
    return this.storeCapacity;
};

StructureTerminal.prototype.__get_resourceLevel = function () {
    return _.sum(this.store);
};
StructureTerminal.prototype.__get_resourceCapacity = function () {
    return this.storeCapacity;
};

StructureTower.prototype.__get_resourceLevel = function () {
    return this.energy;
};
StructureTower.prototype.__get_resourceCapacity = function () {
    return this.energyCapacity;
};
