module.exports = {
	startGame: function (io) {
		//-------- Requiring dependecies ---------
		//global.http = require('http');
		// global.io = require('socket.io')(http);

		//-------- Requiring games & menu --------
		var menu = require('./menu.js');
		var bankoverval = require('./bankoverval.js');
		var hitman = require('./hitman.js');
		var duel = require('./duel.js');
		var hogerlager = require('./hogerlager.js');

		menu.startMenu(io);
		//hitman.importHitman();
		//duel.importDuel();
		//hogerlager.importHogerlager();
		//bankoverval.importBankoverval();
	}
};
