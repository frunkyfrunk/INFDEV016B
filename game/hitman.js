module.exports = {
	importHitman: function () {

		var User = require('./models/user')
			/*-------------------------------------------------------*/
			//Mongoose
			mongoose.connect('mongodb://localhost:27017/DEV016B');
		var db = mongoose.connection;

		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function () {
			console.log('MongoDB connected!');
		});

		/*------------------------------------------------------*/
		//Hitman page
		app.get('/hitman', (req, res) => {
			res.sendfile('public/Hitman.html');
		})

		app.post('/reward/:username', (req, res) => {
			var username;

			if (req.params.username == null) {
				username = req.body.player;
			} else {
				username = req.params.username;
			}

			rewardPlayer(username);

			res.status(200).end();
		})

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
