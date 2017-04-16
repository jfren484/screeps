/// <reference path="../scripts/_references.js" />
let gameData = require('game.data');

module.exports = {
    run: function (creep) {
        if (!creep.is(gameData.constants.ACTION_TRAVELING) && creep.memory.destinationFlag) {
            creep.memory.action = gameData.constants.ACTION_TRAVELING;
            creep.say(creep.memory.action);
        }

        // TODO: Make traveler its own role
        if (creep.is(gameData.constants.ACTION_TRAVELING)) {
            const destinationFlag = Game.flags[creep.memory.destinationFlag];

            if (creep.pos.isNearTo(destinationFlag)) {
                creep.memory.destinationFlag = null;
                creep.memory.action = gameData.constants.ACTION_CLAIMING;
                creep.say(creep.memory.action);
            } else {
                creep.moveTo(destinationFlag);
            }
        }

        if (creep.is(gameData.constants.ACTION_CLAIMING)) {
            let target = creep.room.controller;

            if (target) {
                const result = target.my ? OK : creep.claimController(target);

                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (result === OK) {
                    creep.say('claimed');
                }
            } else {
                console.log(`Claimer ${creep.name} is trying to claim room ${creep.room.name}, but there is no controller present.`);
            }
        }
    }
};