
Crafty.init(1000, 600, document.getElementById('game'));

Crafty.defineScene("login", function () {
	Crafty.background('url(images/menu_background.png)');

	Crafty.e("2D, DOM, Text")
	.attr({
		x: 365,
		y: 75,
		w: 300
	})
	.text("Mafia Gimma")
	.textFont({
		size: '40px',
		weight: 'bold'
	})
	.textColor("#FFFFFF")
	.unselectable();

	Crafty.e("2D, DOM, Text")
	.attr({
		w: 150,
		x: 450,
		y: 250
	})
	.text("Login")
	.textFont({
		size: '28px',
		weight: 'bold'
	})
	.textColor("#FFFFFF")
	.unselectable();

	var usernameField = document.createElement("INPUT");
	usernameField.setAttribute("type", "text");
	usernameField.setAttribute("id", "username")
	usernameField.setAttribute("value", "Username");
	document.getElementById("game").appendChild(usernameField);

	var passwordField = document.createElement("INPUT");
	passwordField.setAttribute("type", "password");
	passwordField.setAttribute("id", "password")
	document.getElementById("game").appendChild(passwordField);

	var signInButton = document.createElement("Button");
	var signInTextNode = document.createTextNode("Sign In");
	signInButton.appendChild(signInTextNode);
	signInButton.setAttribute("id", "signIn");
	document.getElementById("game").appendChild(signInButton);

	var registerButton = document.createElement("Button");
	var registerTextNode = document.createTextNode("Register");
	registerButton.setAttribute("id", "register");
	registerButton.appendChild(registerTextNode);
	document.getElementById("game").appendChild(registerButton);

});

Crafty.enterScene("login");

Crafty.defineScene("menu", function () {

	var timer_hitman = "";
	var timer_duel = "";
	var timer_higherlower = "";
	var timer_bankrobbery = "";
	var user_money = "Loading....";

	socket.on('gameTimes', function (data) {
		timer_hitman = data.timer_hitman;
		timer_duel = data.timer_duel;
		timer_higherlower = data.timer_higherlower;
		timer_bankrobbery = data.timer_bankrobbery;

		if (timer_hitman <= 0)
			timer_hitman = "";
		if (timer_duel <= 0)
			timer_duel = "";
		if (timer_higherlower <= 0)
			timer_higherlower = "";
		if (timer_bankrobbery <= 0)
			timer_bankrobbery = "";

	});

	var parent = document.getElementById("game");
	var usernameInput = document.getElementById("username");
	var passwordInput = document.getElementById("password");
	var signInButton = document.getElementById("signIn");
	var registerButton = document.getElementById("register");

	if (document.body.contains(usernameInput))
		game.removeChild(usernameInput);

	if (document.body.contains(passwordInput))
		game.removeChild(passwordInput);

	if (document.body.contains(signInButton))
		game.removeChild(signInButton);

	if (document.body.contains(registerButton))
		game.removeChild(registerButton);

	socket.emit('getPlayerMoney', {
		username: usernameText.value,
	});

	socket.on('playermoney', function (data) {
		user_money = data.money;
	});

	Crafty.e("2D, Canvas, Image, Mouse")
	.attr({
		x: 250,
		y: 100,
		w: 200,
		h: 200
	})
	.image("images/hitman.png")
	.bind("MouseOver", function () {
		this.image("images/hitman_glow.png");
	})
	.bind("MouseOut", function () {
		this.image("images/hitman.png");
	})
	.bind("Click", function () {
		if (timer_hitman == "") {
			Crafty.enterScene("hitman");
			timer_hitman = 300;
			socket.emit('clientGameTimes', {
				timer_hitman: timer_hitman,
				timer_duel: timer_duel,
				timer_higherlower: timer_higherlower,
				timer_bankrobbery: timer_bankrobbery
			});
		}
	});

	Crafty.e("2D, Canvas, Image, Mouse")
	.attr({
		x: 550,
		y: 100,
		w: 200,
		h: 200
	})
	.image("images/bankoverval.png")
	.bind("MouseOver", function () {
		this.image("images/bankoverval_glow.png");
	})
	.bind("MouseOut", function () {
		this.image("images/bankoverval.png");
	}).bind("Click", function () {
		if (timer_bankrobbery == "") {
			Crafty.enterScene("bankoverval");
			timer_bankrobbery = 300;
			socket.emit('clientGameTimes', {
				timer_hitman: timer_hitman,
				timer_duel: timer_duel,
				timer_higherlower: timer_higherlower,
				timer_bankrobbery: timer_bankrobbery
			});
		}
	});

	Crafty.e("2D, Canvas, Image, Mouse")
	.attr({
		x: 250,
		y: 400,
		w: 200,
		h: 200
	})
	.image("images/duel.png")
	.bind("MouseOver", function () {
		this.image("images/duel_glow.png");
	})
	.bind("MouseOut", function () {
		this.image("images/duel.png");
	}).bind("Click", function () {
		if (timer_duel == "") {
			Crafty.enterScene("dueleren");
			timer_duel = 300;
			socket.emit('clientGameTimes', {
				timer_hitman: timer_hitman,
				timer_duel: timer_duel,
				timer_higherlower: timer_higherlower,
				timer_bankrobbery: timer_bankrobbery
			});
		}
	});

	Crafty.e("2D, Canvas, Image, Mouse")
	.attr({
		x: 550,
		y: 400,
		w: 200,
		h: 200
	})
	.image("images/rsz_higherorlower.png")
	.bind("MouseOver", function () {
		this.image("images/rsz_higherorlowershadow.png");
	})
	.bind("MouseOut", function () {
		this.image("images/rsz_higherorlower.png");
	}).bind("Click", function () {
		if (timer_higherlower == "") {
			Crafty.enterScene("Higherlower");
			timer_higherlower = 300;
			socket.emit('clientGameTimes', {
				timer_hitman: timer_hitman,
				timer_duel: timer_duel,
				timer_higherlower: timer_higherlower,
				timer_bankrobbery: timer_bankrobbery
			});
		}
	});

	var onlinePlayersText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 0,
			y: 0
		})
		.text(function () {
			return "Online Players: " + onlinePlayers
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function onlinePlayersTextFunction() {
		onlinePlayersText.text("Online Players: " + onlinePlayers);
	}, 1000);

	var playerMoneyText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 0,
			y: 50
		})
		.text(function () {
			return "Dolla: " + user_money;
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function playerMoneyTextFunction() {
		playerMoneyText.text("Dolla: " + user_money);
	}, 1000);

	var hitmanTimerText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 300,
			y: 150
		})
		.text(function () {
			return "" + timer_hitman
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function hitmanTimerTextFunction() {
		hitmanTimerText.text("" + timer_hitman);
	}, 1000);

	var bankrobberyTimerText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 600,
			y: 150
		})
		.text(function () {
			return "" + timer_bankrobbery
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function bankrobberyTimerTextFunction() {
		bankrobberyTimerText.text("" + timer_bankrobbery);
	}, 1000);

	var duelTimerText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 300,
			y: 450
		})
		.text(function () {
			return "" + timer_duel
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function duelTimerTextFunction() {
		duelTimerText.text("" + timer_duel);
	}, 1000);

	var higherlowerTimerText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 600,
			y: 450
		})
		.text(function () {
			return "" + timer_higherlower
		})
		.textFont({
			size: '20px',
			weight: 'bold'
		})
		.textColor("#FFFFFF");

	setInterval(function higherlowerTimerTextFunction() {
		higherlowerTimerText.text("" + timer_higherlower);
	}, 1000);

	Crafty.background('url(images/menu_background.png)');

});
