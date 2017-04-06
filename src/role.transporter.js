/// <reference path="../scripts/_references.js" />
module.exports = {
    run: function (creep) {
        let target;

        let containersNeedingReduction = creep.room.find(FIND_STRUCTURES, {
            filter: function (s) {
                return s.structureType === STRUCTURE_CONTAINER && (s.availableResourceCapacity < 500 || s.resourceLevel > s.store.energy);
            }
        });

        let urgentNeeds = creep.room.find(FIND_STRUCTURES, {
            filter: function (s) {
                return s.structureType === STRUCTURE_CONTAINER && s.store.energy < 1000
                    || (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN)
                    && s.availableResourceCapacity > 0;
            }
        });

        if (creep.memory.collecting) {
            if (!creep.carry.availableCarryCapacity) {
                creep.memory.collecting = false;
                creep.say('dispense');
            }
        } else if (!creep.carryLevel) {
            if (containersNeedingReduction.length || urgentNeeds.length) {
                creep.memory.collecting = true;
                creep.say('collect');
            } else {
                creep.say('wait');
            }
        }

        if (creep.memory.collecting) {
            let stores = containersNeedingReduction;

            if (!stores.length) {
                stores = creep.room.find(FIND_STRUCTURES, {
                    filter: function (s) {
                        return (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.resourceLevel;
                    }
                });
            }

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

                let resourceToWithdraw = RESOURCE_ENERGY;
                if (target.resourceLevel > target.store.energy) {
                    // The store has some non-energy resources
                    for (let resource in creep.carry) {
                        if (resource !== resourceToWithdraw) {
                            // Found the first non-energy resource - withdraw that
                            resourceToWithdraw = resource;
                            break;
                        }
                    }
                }

                let result = creep.withdraw(target, resourceToWithdraw);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (result === OK && !creep.availableResourceCapacity) {
                    creep.memory.collecting = false;
                }
            } else {
                creep.memory.collecting = false;
            }
        }

        if (!creep.memory.collecting && (urgentNeeds.length || creep.carryLevel)) {
            let receivers = urgentNeeds;
            if (!receivers.length) {
                receivers = creep.room.find(FIND_STRUCTURES, {
                    filter: function (s) {
                        return s.structureType === STRUCTURE_CONTAINER && s.availableResourceCapacity
                            || s.structureType === STRUCTURE_STORAGE && s.availableResourceCapacity;
                    }
                });
            }

            if (receivers.length) {
                receivers = _.sortBy(receivers, function (s) {
                    let sort = 0;

                    if ((s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.room.energyAvailable < 500) {
                        sort = -1000;
                    } else if (s.structureType === STRUCTURE_CONTAINER) {
                        sort += s.store.energy < 1000 ? 0 : 1000;
                    } else if (s.structureType === STRUCTURE_STORAGE) {
                        // Any non-energy? If so, prioritize storage
                        sort = creep.carryLevel > creep.carry.energy ? -2000 : 500;
                    }

                    return sort + creep.pos.getRangeTo(s);
                });

                target = receivers[0];

                if (creep.pos.isNearTo(target)) {
                    for (let resource in creep.carry) {
                        creep.transfer(target, resource);
                    }
                } else {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};