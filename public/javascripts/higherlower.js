/**
 * Higher/Lower game
 * Author: Frank A. Verhagen
 */

Crafty.defineScene("Higherlower", function () {
	Crafty.init(1000, 600, document.getElementById('game'));

	Crafty.background('#FFFFFF url(img/bg_higher.png) repeat');
	Crafty.audio.play("backgroundMusic", -1);
	Crafty.e("HTML")
	.attr({
		x: 0,
		y: 0,
		w: 1000,
		h: 600
	})
	.append('<div class="col-md-12 text-center">'
		 + '<input class="btn btn-warning pull-left nextlower" value="Lower" style="margin-top:350px; margin-left:50px; min-width:150px" type="submit">'
		 + '<input type="submit" class="btn btn-default" style="margin-top:350px; min-width:150px" id="number" value="3">'
		 + '<input class="btn btn-warning pull-right nexthigher" value="Higher" style="margin-top:350px; margin-right:50px; min-width:150px" type="submit">'
		 + '</div>');
	$('#number').val(getRandomNumber());

	Crafty.e("2D, Canvas, Image, Mouse")
	.attr({
		x: 50,
		y: 50,
		w: 150,
		h: 150
	})
	.image("img/back_arrow_red.png")
	.bind("MouseOver", function () {
		this.image("img/back_arrow_blue.png");
	})
	.bind("MouseOut", function () {
		this.image("img/back_arrow_red.png");
	}).bind("Click", function () {
		Crafty.enterScene("menu");
	});

	function getRandomNumber() {
		return Math.floor((Math.random() * 10) + 1);
	}
	function NextIs(bet) {
		var currentNumber = $('#number').val();
		var nextNumber = getRandomNumber();
		if (bet == 'lower') {
			if (nextNumber <= currentNumber) { //WON
				Won();
			} else {
				Lost();
			}
		}
		if (bet == 'higher') {
			if (nextNumber >= currentNumber) { //WON
				Won();
			} else {
				Lost();
			}
		}
		$('#number').val(nextNumber);
	}

	$(".nextlower").on("click", function () {
		NextIs('lower');
	});

	$(".nexthigher").on("click", function () {
		NextIs('higher');
	});
	function Lost() {
		$('#number').removeClass('btn-success');
		$('#number').addClass('btn-danger');
		socket.emit('punishUser', {
			username: usernameText.value,
			amount: 100
		});
	}
	function Won() {
		$('#number').addClass('btn-success');
		$('#number').removeClass('btn-danger');
		socket.emit('rewardUser', {
			username: usernameText.value,
			amount: 100
		});

		};
});
		Crafty.defineScene("test", function () {
			Crafty.init(1000, 600, document.getElementById('game'));
			Crafty.background('#FFFFFF url(img/g.png) repeat');

		});
