/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');
let renewer = require('role.renewer');

module.exports = {
    run: function (creep) {
        const nearbyHostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

        if (renewer.renewCheck(creep,
                (c) => c.ticksToLive < 500 && !nearbyHostileCreeps.length,
                (c) => c.memory.action = gameData.constants.ACTION_DEFENDING)) {
            return;
        }

        if (creep.takeUnoccupiedPost() === gameData.constants.RESULT_AT_POST) {
            if (nearbyHostileCreeps.length === 1) {
                creep.rangedAttack(nearbyHostileCreeps[0]);
            } else if (nearbyHostileCreeps.length > 1) {
                creep.rangedMassAttack();
            }
        }
    }
};