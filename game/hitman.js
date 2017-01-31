module.exports = {
	importHitman: function () {
		
		var app = require('../app');
		var User = require('../models/user')
		
		/*-------------------------------------------------------*/
		//Mongoose
		var mongoose = require('mongoose');
		mongoose.connect('mongodb://localhost:27017/DEV016B');
		var db = mongoose.connection;

		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function () {
			console.log('MongoDB connected!');
		});

		/*------------------------------------------------------*/
		// //Hitman page
		// app.post('/reward/:username', (req, res) => {
			// var username = app.locals.login;

			// rewardPlayer(username);

			// res.status(200).end();
		// })

		/*------------------------------------------------------------*/
		//Fuctions Mongoose
		function rewardPlayer(name) {
			console.log('\t Player: ' + name);
			var query = User.findOne({
					username: name
				}, function (err, doc) {
					var oldMoney = doc.money;
					var newMoney = oldMoney + 25;

					console.log('\t Old money: ' + oldMoney);
					console.log('\t New money: ' + newMoney);

					doc.money = newMoney;
					doc.save();
					console.log('\t Player is rewarded $' + (newMoney - oldMoney));
				});
		}

	}
};