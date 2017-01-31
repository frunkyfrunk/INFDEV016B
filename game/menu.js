module.exports = {
	startMenu: function (io) {
		var usernameHolder;
		var passwordHoler;
		var create_response;
		var log_response;
		var ENEMY_LIST = {};

		io.on('connection', function (socket) {
			SOCKET_LIST[socket.id] = socket;
			PLAYER_LIST.push(socket.id);

			getTopPlayers();
			var timer_hitman = 0;
			var timer_duel = 0;
			var timer_higherlower = 0;
			var timer_bankrobbery = 0;

			console.log('active players ' + PLAYER_LIST.length);
			console.log('socket ' + socket.id + ' has connected to the server ');

			socket.on('signInData', function (data) {
				isPasswordValid(data)
				setTimeout(function () {
					if (log_response == true) {
						log_response = false;
						socket.emit('signInResponse', {
							success: true
						});
						io.emit('onlinePlayersUpdate', {
							onlinePlayers: PLAYER_LIST.length
						});
					} else {
						socket.emit('signInResponse', {
							success: false
						});
					}
				}, 1000);
			});

			socket.on('registerData', function (data) {
				isUsernameAvailable(data)
				setTimeout(function () {
					if (create_response == true) {
						create_response = false;
						socket.emit('registerResponse', {
							success: true
						});

					} else {
						socket.emit('registerResponse', {
							success: false
						});
					}
				}, 1000);
			});

			socket.on('disconnect', function () {
				console.log('socket ' + socket.id + ' disconnected');
				PLAYER_LIST.splice(socket.id, 1);
				socket.broadcast.emit('onlinePlayersUpdate', {
					onlinePlayers: PLAYER_LIST.length
				});
			});

			socket.on('clientGameTimes', function (data) {
				timer_hitman = data.timer_hitman;
				timer_bankrobbery = data.timer_bankrobbery;
				timer_duel = data.timer_duel;
				timer_higherlower = data.timer_higherlower;
			});

			setInterval(function timer_game() {
				if (timer_hitman > 0)
					timer_hitman -= 1;
				if (timer_duel > 0)
					timer_duel -= 1;
				if (timer_higherlower > 0)
					timer_higherlower -= 1;
				if (timer_bankrobbery > 0)
					timer_bankrobbery -= 1;

				socket.emit('gameTimes', {
					timer_hitman: timer_hitman,
					timer_duel: timer_duel,
					timer_higherlower: timer_higherlower,
					timer_bankrobbery: timer_bankrobbery
				});

			}, 1000);

			socket.on('rewardUser', function (data) {
				rewardPlayer(data.username, data.amount);

			});

			socket.on('punishUser', function (data) {
				punishPlayer(data.username, data.amount);
			});

			socket.on('sendTopPlayers', function () {
				console.log(ENEMY_LIST[0]);
				socket.emit('topPlayers', {
					ENEMY_LIST: ENEMY_LIST
				});
			});

			socket.on('getPlayerMoney', function (data) {
				getUser(data);
				console.log(UserDetails.money);
				socket.emit('playermoney', {
					money: UserDetails.money

				});
			});

		});

		var User = require('../models/user');
		var UserDetails;

		function getUser(data) {
			User.findOne({
				username: data.username
			}, function (err, user) {
				if (err) {
					return handleError(err);
				}
				UserDetails = user;

			});
		};

		function insertUser(data) {
			var newUser = new User({
					username: data.username,
					password: data.password,
					money: 1000
				});
			newUser.save();
			console.log("User succesfully added");

		};

		function isPasswordValid(data) {
			getUser(data);
			setTimeout(function () {
				if (UserDetails != null && data.password == UserDetails.password) {
					console.log("password is correct");
					log_response = true;
				} else {
					console.log("Username or password is incorrect");
					log_response = false;
				}
			}, 500);
		};

		function isUsernameAvailable(data) {
			getUser(data);
			setTimeout(function () {
				if (UserDetails != null) {
					console.log("Username is unavailable");
					create_response = false;
				} else {
					console.log("Username is available")
					insertUser(data);
					create_response = true;
				};
			}, 500);

		};

		function rewardPlayer(name, amount) {
			console.log('\t Player: ' + name);
			var query = User.findOne({
					username: name
				}, function (err, doc) {
					var oldMoney = doc.money;
					var newMoney = oldMoney + amount;

					console.log('\t Old money: ' + oldMoney);
					console.log('\t New money: ' + newMoney);

					doc.money = newMoney;
					doc.save();
					console.log('\t Player is rewarded $' + (newMoney - oldMoney));
				});
		};

		function punishPlayer(name, amount) {
			console.log('\t Player: ' + name);
			var query = User.findOne({
					username: name
				}, function (err, doc) {
					var oldMoney = doc.money;
					var newMoney = oldMoney - amount;

					console.log('\t Old money: ' + oldMoney);
					console.log('\t New money: ' + newMoney);

					doc.money = newMoney;
					doc.save();
					console.log('\t Player is rewarded $' + (newMoney - oldMoney));
				});
		};

		function getTopPlayers() {
			var query = User.find(function (err, kittens) {
					if (err)
						return console.error(err);

					kittens.sort(function (a, b) {
						return b.money - a.money
					});

					for (var i = 0; i < 5; i++) {
						ENEMY_LIST[i] = kittens[i];
					}
				});
		};

	}
};
