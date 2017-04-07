let creepRoles = {
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

let roleData = {
    'harvester': {
        optimalCount: 2,
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
        }
    },
    'transporter': {
        optimalCount: 2,
        bodies: {
            1: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'builder': {
        optimalCount: 3,
        bodies: {
            1: [WORK, CARRY, CARRY, MOVE, MOVE],
            2: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'upgrader': {
        optimalCount: 2,
        bodies: {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, WORK, CARRY, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
        }
    },
    'scavenger': {
        optimalCount: 1,
        bodies: {
            2: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        }
    },
    'sentry': {
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

for (let roleName in creepRoles) {
    creepRoles[roleName].bodyCost = _.sum(creepRoles[roleName].body.map(function (p) {
        return BODYPART_COST[p];
    }));
}

let rooms = {
    'W84S61': {
        harvesterPosts: [{x: 30, y: 16}, {x: 13, y: 26}],
        scavengerPosts: [{x: 23, y: 21}, {x: 31, y: 10}],
        sentryPosts: [{x: 23, y: 19}, {x: 29, y: 8}],
        soldierPosts: [{x: 27, y: 12}, {x: 28, y: 12}, {x: 29, y: 12}, {x: 30, y: 12}, {x: 31, y: 12}],
        upgraderPosts: [{x: 11, y: 27}, {x: 13, y: 27}, {x: 12, y: 27}/*, {x: 10, y: 27}*/],
        upgraderContainerPosition: {x: 12, y: 27}
    }
};

module.exports = {
    creepRoles: creepRoles,
    myRooms: rooms,
    renewThreshold: 1450
};