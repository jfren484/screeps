/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

/* Creep */

Object.defineProperty(Creep.prototype, 'availableCarryCapacity', {
    get: function () {
        if (this === Creep.prototype || this === undefined) return;

        return this.carryCapacity - this.carryLevel;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'carryLevel', {
    get: function () {
        if (this === Creep.prototype || this === undefined) return;

        return _.sum(this.carry);
    },
    enumerable: true,
    configurable: true
});

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

Object.defineProperty(Creep.prototype, 'spawn', {
    get: function () {
        if (this === Creep.prototype || this === undefined) return;

        if (this._spawn === undefined) {
            if (this.memory.spawnId === undefined) {
                this.memory.spawnId = (this.pos.findClosestByRange(FIND_MY_SPAWNS) || {id: null}).id;
            }

            this._spawn = Game.getObjectById(this.memory.spawnId);
        }

        return this._spawn;
    },
    enumerable: false,
    configurable: true
});

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

Object.defineProperty(Room.prototype, 'energyLevel', {
    get: function () {
        if (this === Room.prototype || this === undefined) return;

        if (this._energyLevel === undefined) {
            const translation = [0, 300, 550, 800, 1300, 1800, 2300, 5600, 12900];
            /*
             Energy Max:
             1: 300
             2: 550 - 5 ext
             3: 800 - 10 ext
             4: 1300 - 20 ext
             5: 1800 - 30 ext
             6: 2300 - 40 ext
             7: 5600 - 50 ext (100), 2 spawns
             8: 12900 - 60 ext (200), 3 spawns
             */

            for (this._energyLevel = 1; this.energyCapacityAvailable >= translation[this._energyLevel] && this._energyLevel <= translation.length; ++this._energyLevel) {
                // Do nothing - all logic is in for statements.
            }

            // For loop always goes 1 level too far - roll back 1.
            --this._energyLevel;
        }

        return this._energyLevel;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myCreeps', {
    get: function () {
        if (this === Room.prototype || this === undefined) return;

        return _.filter(Game.creeps, (creep) => creep.room.name === this.name);
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        if (this === Room.prototype || this === undefined) return;

        if (!this._sources) {
            if (!this.memory.sourceIds) {
                this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
            }

            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }

        return this._sources;
    },
    enumerable: false,
    configurable: true
});

Room.prototype.stats = function () {
    const width = 20;
    const room = this;

    let creepStats = Object
        .keys(gameData.creepRoles)
        .sort()
        .map(function (roleName) {
            let creeps = _.filter(room.myCreeps, (c) => c.memory.role === roleName);
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

Spawn.prototype.createCreepWithRole_old = function (roleName, creepName) {
    let creepRole = gameData.creepRoles[roleName];

    return this.createCreep(creepRole.body, creepName, {role: roleName, createdOn: new Date()});
};

Spawn.prototype.createCreepWithRole = function (roleName, creepName) {
    const creepRole = gameData.creepRoles[roleName];

    for (let level = this.room.energyLevel; level > 0 && !creepRole.bodies[level]; --level) {
        // Do nothing - all logic is in "for" statements.
    }
    const creepBody = creepRole.bodies[level];

    if (!creepBody) {
        console.log(`Can't find body definition for ${roleName} in level ${this.room.energyLevel} room ${this.room.name}`);
        return;
    }

    let result = this.canCreateCreep(creepBody);
    if (result === OK) {
        let newName = this.createCreep(creepBody, creepName, {role: roleName, createdOn: new Date()});

        console.log(`Spawning new ${roleName} in ${this.room.name}: ${newName}`);

        return newName;
    } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
        console.log(new Date() + ': canCreateCreep returned ' + result + ' for creep role ' + roleName);
    }
};

/* Structure Resource Capacity */

Object.defineProperty(Structure.prototype, 'resourceLevel', {
    get: function () {
        if (this === Structure.prototype || this === undefined) return;

        return this.__get_resourceLevel();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Structure.prototype, 'resourceCapacity', {
    get: function () {
        if (this === Structure.prototype || this === undefined) return;

        return this.__get_resourceCapacity();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Structure.prototype, 'availableResourceCapacity', {
    get: function () {
        if (this === Structure.prototype || this === undefined) return;

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
