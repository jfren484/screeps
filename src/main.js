/// <reference path="../scripts/_references.js" />
require('base.prototypes');

let gameSpawns = require('game.spawns');
let gameCreeps = require('game.creeps');
let gameTowers = require('game.towers');

module.exports.loop = function () {
    gameSpawns.run();
    gameCreeps.run();
    gameTowers.run();
};
