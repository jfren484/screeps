var gameData = require('game.data');

Creep.prototype.getTarget = function() {
    let target = null;
    
    if (this.memory.targetId) {
        target = Game.getObjectById(this.memory.targetId);
        
        if (!target) {
            this.memory.targetId = null;
        }
    }
    
    return target;
};

Creep.prototype.takeUnoccupiedPost = function(postPosArray) {
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

Room.prototype.creepStats = function() {
    return Object.keys(gameData.creepRoles)
                 .sort()
                 .map(function(roleName) {
                     let creeps = _.filter(Game.creeps, (c) => c.memory.role === roleName);
                     let count = creeps.length;
                     let names = creeps.map(function(c) { return c.name; });
                     let pad = ' '.repeat(15 - roleName.length);
                     return roleName.charAt(0).toUpperCase() + roleName.slice(1) + 's:' + pad + count + ' (' + names.join(', ') + ')';
                 })
                 .join('\n');
};

Spawn.prototype.renewMyAdjacentCreeps = function() {
    let spawn = this;
    
    if (spawn.energy >= 50) {
        spawn.room
             .lookForAtArea(LOOK_CREEPS, spawn.pos.y - 1, spawn.pos.x - 1, spawn.pos.y + 1, spawn.pos.x + 1, true)
             .map(function(found) { return found.creep; })
             .filter(function(creep) { return creep.my && creep.ticksToLive < 1400; })
             .forEach(function(creep) {
                 if (spawn.renewCreep(creep) === 0) {
                     creep.say('👍');
                 }
             });
    }
};

Spawn.prototype.spawnNewCreeps_old = function() {
    let spawn = this, role, newName;

    if (spawn.spawning) {
        role = Game.creeps[spawn.spawning.name].memory.role;
        spawn.room.visual.text('Spawning ' + role, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
    } else if (spawn.room.energyAvailable >= 550) {
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    
        role = harvesters.length < 3
            ? 'harvester'
            : upgraders.length < 1
                ? 'upgrader'
                : builders.length < 3
                    ? 'builder'
                    : upgraders.length < 2
                        ? 'upgrader'
                        : null;

        if (role) {
            newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: role, createdOn: new Date()});

            console.log('Spawning new ' + role + ': ' + newName);
        } else {
            let transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');

            role = transporters.length < 2 ? 'transporter' : '';

            if (role) {
                newName = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: role, createdOn: new Date()});
            
                console.log('Spawning new ' + role + ': ' + newName);
            } else {
                let archers = _.filter(Game.creeps, (creep) => creep.memory.role == 'archer');

                role = archers.length < 0 ? 'archer' : '';

                if (role) {
                    newName = spawn.createCreep([RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE], undefined, {role: role, createdOn: new Date()});
                
                    console.log('Spawning new ' + role + ': ' + newName);
                }
            }
        }
    }
};

Spawn.prototype.spawnNewCreeps = function() {
    let spawn = this;

    if (spawn.spawning) {
        let role = Game.creeps[spawn.spawning.name].memory.role;
        spawn.room.visual.text('Spawning ' + role, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
        
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
            let newName = spawn.createCreep(creepRole.body, undefined, {role: roleName, createdOn: new Date()});

            console.log('Spawning new ' + roleName + ': ' + newName);
        } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
            console.log(new Date() + ': canCreateCreep returned ' + result + ' for creep role ' + roleName);
        }

        return;
    }
};

StructureContainer.prototype.availableCapacity = function() {
    return this.storeCapacity - _.sum(this.store);
};