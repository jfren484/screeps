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
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_HARVESTING,
        name: 'Hrv',
        optimalCount: function (room, posts) {
            return posts.length;
        }
    },
    'transporter': {
        bodies: {
            1: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_LOADING,
        name: 'Trn',
        optimalCount: function (room) {
            return room.sources.length + 1;
        }
    },
    'builder': {
        bodies: {
            1: [WORK, CARRY, CARRY, MOVE, MOVE],
            2: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            5: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_LOADING,
        name: 'Bld',
        optimalCount: function (room) {
            return room.sources.length;
        }
    },
    'upgrader': {
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
        },
        defaultAction: constants.ACTION_LOADING,
        name: 'Upg',
        optimalCount: function (room, posts) {
            return posts.length;
        }
    },
    'scavenger': {
        bodies: {
            2: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_LOADING,
        isRenewComplete: function (creep) {
            return creep.ticksToLive > renewThresholds.defaultRenew && creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        },
        name: 'Scv',
        optimalCount: function (room, posts) {
            return room.energyLevel >= 2 ? posts.length : 0;
        }
    },
    'sentry': {
        bodies: {
            2: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            4: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_DEFENDING,
        name: 'Snt',
        optimalCount: function (room, posts) {
            return room.energyLevel >= 2 ? posts.length : 0;
        },
    },
    'infantry': {
        bodies: {
            4: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        defaultAction: constants.ACTION_ATTACKING,
        name: 'Inf'
    },
    'claimer': {
        bodies: {0: [CLAIM, MOVE]},
        defaultAction: constants.ACTION_CLAIMING,
        name: 'Clm'
    },
    'colonizer': {
        bodies: {
            3: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        defaultAction: '',
        name: 'Col'
    },
    'recycler': {},
    'renewer': {},
    'traveller': {}
};

const rooms = {
    'W81S61': {
        posts: {
            'harvester': [{x: 3, y: 20}, {x: 5, y: 20}],
            'scavenger': [{x: 7, y: 18}],
            'sentry': [10, 20],
            'infantry': [],
            'upgrader': [{x: 26, y: 7}]
        }
    },
    'W82S61': {
        posts: {
            'harvester': [{x: 39, y: 16}],
            'scavenger': [{x: 33, y: 21}],
            'sentry': [{x: 39, y: 9}],
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
            'upgrader': [{x: 11, y: 27}]
        }
    }
};

module.exports = {
    constants: constants,
    creepRoles: creepRoles,
    myRooms: rooms,
    renewThresholds: renewThresholds
};