/// <reference path="../scripts/_references.js" />
module.exports = {
    run: function (creep) {
        if (creep.memory.isClaiming) {
            let target = creep.room.controller;

            if (target) {
                if (creep.claimController(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            let claimPosition = Game.flags['Claim'];
            if (!claimPosition) {
                creep.say('Zzzz');
                return;
            }

            if (creep.pos.isNearTo(claimPosition)) {
                creep.memory.isClaiming = true;
            }

            creep.moveTo(claimPosition);
        }
    }
};