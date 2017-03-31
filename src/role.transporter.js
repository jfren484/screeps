/// <reference path="../scripts/_references.js" />
module.exports = {
    run: function (creep) {
        let target = creep.getTarget();

        if (creep.memory.collecting) {
            if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.collecting = false;
                target = null;
                creep.memory.targetId = null;
                creep.say('dispense');
            } else if (target && !target.energy && (!target.store || !target.store.energy)) {
                target = null;
                creep.memory.targetId = null;
                creep.say('switching');
            }
        } else if (creep.carry.energy === 0) {
            creep.memory.collecting = true;
            target = null;
            creep.memory.targetId = null;
            creep.say('collect');
        }

        if (creep.memory.collecting) {
            if (!target) {
                let stores = creep.room.find(FIND_STRUCTURES, {
                    filter: function (s) {
                        return (s.structureType === STRUCTURE_CONTAINER ||
                            s.my && s.structureType === STRUCTURE_STORAGE) &&
                            s.store.energy;
                    }
                });

                if (stores.length) {
                    stores = _.sortBy(stores, function (s) {
                        let firstSort = s.structureType === STRUCTURE_CONTAINER && s.store.energy >= 1000
                            ? -10000
                            : s.structureType === STRUCTURE_STORAGE
                                ? -5000
                                : 0;

                        return firstSort + creep.pos.getRangeTo(s);
                    });

                    target = stores[0];
                    creep.memory.targetId = target.id;
                } else {
                    creep.memory.collecting = false;
                }
            }

            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.memory.lastCollectedFromId = target.id;
                }
            }
        } else {
            if (!target) {
                let receivers = creep.room.find(FIND_STRUCTURES, {
                    filter: function (s) {
                        return s.structureType === STRUCTURE_CONTAINER && s.availableCapacity() >= creep.carry.energy
                            || s.structureType === STRUCTURE_STORAGE && s.storeCapacity - _.sum(s.store) >= creep.carry.energy
                            || (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER)
                            && s.energyCapacity > s.energy
                            || s.structureType === STRUCTURE_SPAWN && s.energyCapacity - s.energy > creep.carry.energy;
                    }
                });

                if (receivers.length) {
                    receivers = _.sortBy(receivers, function (c) {
                        let sort = 0;

                        if (c.structureType === STRUCTURE_SPAWN && c.energy <= 100) {
                            sort = -10000;
                        } else if (c.structureType === STRUCTURE_CONTAINER) {
                            sort += Math.round(c.store.energy / 300) * 300;
                        } else if (c.structureType === STRUCTURE_STORAGE) {
                            sort = 300;
                        }

                        return sort + creep.pos.getRangeTo(c);
                    });

                    target = receivers[0];
                    creep.memory.targetId = target.id;
                }
            }

            if (target) {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (result === ERR_FULL) {
                    creep.memory.targetId = null;
                }
            }
        }
    }
};