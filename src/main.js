require('base.prototypes');

var gameData = require('game.data');
var gameSpawns = require('game.spawns');
var gameCreeps = require('game.creeps');
var gameTowers = require('game.towers');

module.exports.loop = function () {
    gameSpawns.run();
    gameCreeps.run();
    gameTowers.run();
}
