const constants = {
    ACTION_ATTACKING: 'attack',
    ACTION_BUILDING: 'build',
    ACTION_CLAIMING: 'claim',
    ACTION_DEFENDING: 'defend',
    ACTION_DISPENSING: 'dispense',
    ACTION_HARVESTING: 'harvest',
    ACTION_LOADING: 'load',
    ACTION_REPAIRING: 'repair',
    ACTION_TRAVELING: 'travel',
    ACTION_UPGRADING: 'upgrade',
    ACTION_WAITING: 'wait',
    RESULT_AT_POST: 'at post',
    RESULT_MOVED: 'moved'
};

const renewThresholds = {
    lowEnergyAbort: 50,
    complete: 1450,
    defaultRenew: 200
};

const creepRoles = {
    'harvester': {
        defaultAction: constants.ACTION_HARVESTING,
        optimalCount: function (room, posts) {
            return posts.length;
        },
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
        }
    },
    'transporter': {
        defaultAction: constants.ACTION_LOADING,
        optimalCount: function (room) {
            return room.sources.length + 1;
        },
        bodies: {
            1: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'builder': {
        defaultAction: constants.ACTION_LOADING,
        optimalCount: function (room) {
            return room.sources.length;
        },
        bodies: {
            1: [WORK, CARRY, CARRY, MOVE, MOVE],
            2: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            5: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'upgrader': {
        defaultAction: constants.ACTION_LOADING,
        optimalCount: function (room, posts) {
            return posts.length;
        },
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
        }
    },
    'scavenger': {
        defaultAction: constants.ACTION_LOADING,
        optimalCount: function (room, posts) {
            return room.energyLevel >= 2 ? posts.length : 0;
        },
        bodies: {
            2: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        isRenewComplete: function (creep) {
            return creep.ticksToLive > renewThresholds.defaultRenew && creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        }
    },
    'sentry': {
        defaultAction: constants.ACTION_DEFENDING,
        optimalCount: function (room, posts) {
            return room.energyLevel >= 2 ? posts.length : 0;
        },
        bodies: {
            2: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            4: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
        }
    },
    'infantry': {
        defaultAction: constants.ACTION_ATTACKING,
        bodies: {
            4: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'claimer': {
        defaultAction: constants.ACTION_WAITING,
        bodies: {0: [CLAIM, MOVE]}
    },
    'colonizer': {
        defaultAction: constants.ACTION_WAITING,
        bodies: {
            3: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'recycler': {},
    'renewer': {}
};

const rooms = {
    'W82S61': {
        posts: {
            'harvester': [{x: 39, y: 16}],
            'scavenger': [{x: 33, y: 21}],
            'sentry': [{x: 40, y: 9}],
            'infantry': [{x: 32, y: 14}, {x: 32, y: 15}],
            'upgrader': [{x: 36, y: 27}]
        }
    },
    'W83S61': {
        posts: {
            'harvester': [{x: 12, y: 20}, {x: 41, y: 7}],
            'scavenger': [{x: 24, y: 16}],
            'sentry': [{x: 13, y: 3}],
            'infantry': [{x: 28, y: 15}, {x: 23, y: 18}],
            'upgrader': [{x: 29, y: 21}, {x: 30, y: 20}]
        }
    },
    'W84S61': {
        posts: {
            'harvester': [{x: 30, y: 16}, {x: 13, y: 26}],
            'scavenger': [{x: 23, y: 21}],
            'sentry': [{x: 23, y: 19}, {x: 29, y: 8}],
            'infantry': [{x: 27, y: 12}, {x: 28, y: 12}, {x: 29, y: 12}, {x: 30, y: 12}, {x: 31, y: 12}],
            'upgrader': [{x: 11, y: 27}, {x: 13, y: 27}, {x: 12, y: 27}]
        }
    }
};

module.exports = {
    constants: constants,
    creepRoles: creepRoles,
    myRooms: rooms,
    renewThresholds: renewThresholds
};