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
            let attackPosition = Game.flags['Attack Position'];

            if (attackPosition && creep.pos.getRangeTo(attackPosition) < 2) {
                creep.memory.isClaiming = true;
            }

            creep.moveTo(attackPosition);
        }
    }
};