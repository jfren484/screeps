let creepRoles = {
    'harvester': {
        optimalCount: 2,
        body: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]
    },
    'transporter': {
        optimalCount: 2,
        body: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
    },
    'builder': {
        optimalCount: 3,
        body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
    },
    'archer': {
        optimalCount: 2,
        body: [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE]
    },
    'upgrader': {
        optimalCount: 4,
        body: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]
    },
    'scavenger': {
        optimalCount: 1,
        body: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
    },
    'recycler': {
        optimalCount: 0,
        body: []
    }
};

for (let roleName in creepRoles) {
    creepRoles[roleName].bodyCost = _.sum(creepRoles[roleName].body.map(function(p) {return BODYPART_COST[p];}));
}

let rooms = {
    'W84S61': {
        archerPosts: [{x: 22, y: 19}, {x: 28, y: 8}],
        harvesterPosts: [{x: 30, y: 16}, {x: 13, y: 26}],
        scavengerPosts: [{x: 16, y: 28}],
        upgraderPosts: [{x: 11, y: 27}, {x: 13, y: 27}, {x: 12, y: 27}, {x: 10, y: 27}],
        upgraderContainerPosition: {x: 12, y: 27}
    }
};

module.exports = {
    creepRoles: creepRoles,
    myRooms: rooms
};