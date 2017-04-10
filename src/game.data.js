let creepRoles0 = {
    'harvester': {
        optimalCount: 2,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
    },
    'transporter': {
        optimalCount: 3,
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    'builder': {
        optimalCount: 3,
        body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    },
    'upgrader': {
        optimalCount: 3,
        body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
    },
    'scavenger': {
        optimalCount: 1,
        body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    },
    'sentry': {
        optimalCount: 2,
        body: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
    },
    'infantry': {
        optimalCount: 4,
        body: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    'claimer': {
        optimalCount: 0,
        body: [CLAIM, MOVE]
    },
    'colonizer': {
        optimalCount: 0,
        body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    'recycler': {optimalCount: 0, body: []}
};

let creepRoles = {
    'harvester': {
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
        optimalCount: function (room) {
            return room.sources.length;
        },
        bodies: {
            1: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'builder': {
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
        optimalCount: function (room, posts) {
            return posts.length;
        },
        bodies: {
            2: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'sentry': {
        optimalCount: function (room, posts) {
            return posts.length;
        },
        bodies: {
            2: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            4: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
        }
    },
    'infantry': {
        bodies: {
            4: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'claimer': {
        bodies: {0: [CLAIM, MOVE]}
    },
    'colonizer': {
        bodies: {
            3: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'recycler': {}
};

let rooms = {
    'W82S61': {
        posts: {
            'harvester': [{x: 39, y: 16}],
            'scavenger': [{x: 24, y: 22}],
            'sentry': [],
            'infantry': [],
            'upgrader': [{x: 36, y: 27}, {x: 36, y: 28}]
        }
    },
    'W83S61': {
        posts: {
            'harvester': [{x: 12, y: 20}, {x: 41, y: 7}],
            'scavenger': [{x: 22, y: 15}],
            'sentry': [],
            'infantry': [],
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
    creepRoles: creepRoles,
    myRooms: rooms,
    renewThreshold: 1450
};