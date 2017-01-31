module.exports = {
	startMenu: function (io) {
		var usernameHolder;
		var passwordHoler;
		var create_response;
		var log_response;
		var ENEMY_LIST = {};
		var SOCKET_LIST_DUELEREN = {};
		var PLAYER_LIST_DUELEREN = {};
		var BULLET_LIST_DUELEREN = {};
		var VELOCITY_LIST = {
			0: {
				x: 0,
				y: -1
			}, // up
			45: {
				x: 1,
				y: -1
			}, // up-right
			315: {
				x: -1,
				y: -1
			}, //up-left
			180: {
				x: 0,
				y: 1
			}, //down
			135: {
				x: 1,
				y: 1
			}, //down-right
			225: {
				x: -1,
				y: 1
			}, //down-left
			90: {
				x: 1,
				y: 0
			}, //right
			270: {
				x: -1,
				y: 0
			} //left
		};

		io.on('connection', function (socket) {
			SOCKET_LIST[socket.id] = socket;
			PLAYER_LIST.push(socket.id);

			socket.on('JoinDueleren', function () {
				SOCKET_LIST_DUELEREN[socket.id] = socket;

				var player = new Player(socket.id);
				PLAYER_LIST_DUELEREN[socket.id] = player;

				onConnect(socket.id);
			});
			

			socket.on('keyPress', function (data) {
				var player = PLAYER_LIST_DUELEREN[socket.id]
				if(player != undefined)
				player.updateState(data.inputId);
			});
			socket.on('playerAngle', function (data) {
				var player = PLAYER_LIST_DUELEREN[socket.id]
				if(player != undefined)
				player._angle = data;
			});

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
				PlayerRemove(socket.id);
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

		setInterval(function () {

			for (var i in SOCKET_LIST_DUELEREN) {
				var socket = SOCKET_LIST_DUELEREN[i];
				socket.emit('newPositions', PlayersInitPackage());
				socket.emit('bulletPositions', BulletPackage());
			}

		}, 1000 / 100);

		function onConnect(socketID) {
			var socket = SOCKET_LIST_DUELEREN[socketID];
			socket.emit('onConnect', socketID);
		}

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

		setInterval(function () {

			for (var i in PLAYER_LIST_DUELEREN) {
				var player = PLAYER_LIST_DUELEREN[i];
				player.updatePosition();
			}

			for (var i in BULLET_LIST_DUELEREN) {
				var bullet = BULLET_LIST_DUELEREN[i];
				bullet.update();
			}
		}, 1000 / 30);

		function PlayerRemove(socketID) {

			var pack = socketID;
			for (var i in SOCKET_LIST_DUELEREN) {
				var socket = SOCKET_LIST_DUELEREN[i];
				socket.emit('PlayerRemove', pack);
			}
			delete PLAYER_LIST_DUELEREN[socketID];
			delete SOCKET_LIST_DUELEREN[socketID];
			console.log("Player has been deleted with id " + socketID);
		}

		function PlayersInitPackage() {
			var pack = [];
			for (var i in PLAYER_LIST_DUELEREN) {
				var player = PLAYER_LIST_DUELEREN[i];
				pack.push({
					hp: player._hp,
					angle: player._angle,
					state: player._state,
					x: player._x,
					y: player._y,
					id: player._id
				});
			}
			return pack;
		};

		function BulletPackage() {
			var pack = [];
			for (var i in BULLET_LIST_DUELEREN) {
				var bullet = BULLET_LIST_DUELEREN[i];
				pack.push({
					player: bullet._playerId,
					id: bullet._id,
					x: bullet._x,
					y: bullet._y
				});
			}
			return pack;
		}

		class Player {
			constructor(id) {
				this._id = id;
				this._x = Math.floor(Math.random() * 1700) + 750;
				this._y = Math.floor(Math.random() * 1700) + 750;
				this._hp = 5;
				this._speed = 7;
				this._state;
				this._angle = 0;
				this._timer = 0;
				console.log("Player has been created with id " + this._id);
			}

			updateState(state) {
				this._state = state;
			}

			updatePosition() {
				if (this._state == "up-right") {
					this._x += this._speed * 0.66;
					this._y -= this._speed * 0.66;
				} else if (this._state == "up-left") {
					this._x -= this._speed * 0.66;
					this._y -= this._speed * 0.66;
				} else if (this._state == "down-right") {
					this._x += this._speed * 0.66;
					this._y += this._speed * 0.66;
				} else if (this._state == "down-left") {
					this._x -= this._speed * 0.66;
					this._y += this._speed * 0.66;
				} else if (this._state == "right")
					this._x += this._speed;
				else if (this._state == "left")
					this._x -= this._speed;
				else if (this._state == "up")
					this._y -= this._speed;
				else if (this._state == "down")
					this._y += this._speed;
				else if (this._state == "shoot") {
					if (this._timer-- < 0) {
						var pack = {
							x: this._x,
							y: this._y
						};
						var bulletId = Math.random();
						var bullet = new Bullet(this._id, bulletId, pack, VELOCITY_LIST[this._angle]);
						BULLET_LIST_DUELEREN[bulletId] = bullet;
						this._timer = 5;
					}
				}

				if (this._y <= 675)
					this._y = 675

						if (this._y >= 2550)
							this._y = 2550

								if (this._x <= 675)
									this._x = 675

										if (this._x >= 2550)
											this._x = 2550
			}

			getPosition() {
				var x = this._x;
				var y = this._y;
				return {
					x: x,
					y: y
				};
			}

		}

		class Bullet {
			constructor(id, bulletId, position, vector) {
				this._playerId = id;
				this._id = bulletId;
				this._damage = 1;
				this._speedX = vector.x * 15;
				this._speedY = vector.y * 15;
				this._timer = 0;
				this._x = position.x;
				this._y = position.y;
				console.log("Bullet has been created with id " + this._id);

			}

			getDistance(pt) {
				return Math.sqrt(Math.pow(this._x - pt._x, 2) + Math.pow(this._y - pt._y, 2));
			}

			update() {
				this._x += this._speedX;
				this._y += this._speedY;
				if (this._timer++ > 50) {
					io.sockets.emit('BulletRemove', this._id);
					console.log("Bullet has been deleted with id " + this._id);
					delete BULLET_LIST_DUELEREN[this._id];

				}

				for (var i in PLAYER_LIST_DUELEREN) {
					var p = PLAYER_LIST_DUELEREN[i];
					if (this.getDistance(p) < 32 && p._id !== this._playerId) {
						io.sockets.emit('BulletRemove', this._id);
						p._hp -= 1;
						delete BULLET_LIST_DUELEREN[this._id];

						if (p._hp == 0) {
							var socket = SOCKET_LIST_DUELEREN[p._id];
							socket.emit("LeaveScene");
							PlayerRemove(p._id);
						}
					}
				}
			}

		}

	}
};
