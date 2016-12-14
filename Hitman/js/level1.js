	jQuery(document).ready(function($){
		
		//Loading scene
		Crafty.scene("loading", function() {
		// Load our assets
		Crafty.load([], function() {
			setTimeout(function() { 
				Crafty.scene("main"); // Play the main scene
			}, 4000);
		});
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 490, y: 100})
				.text("MISSION")
				.textFont({size: '22px', family: 'Arial', weight: 'bold'})
				.textColor('white');
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 325, y: 180})
				.text("My accountant stole all my money. Take him out!")
				.textFont({size: '20px', family: 'Arial', weight: 'bold'})
				.textColor('white');

		});

		//Main scene
		Crafty.scene("main",function() {
			Crafty.background('#FFFFFF url(../Hitman/img/bg_level1.png) no-repeat center center');
			
			Crafty.audio.add("shoot", "../Hitman/sounds/gun.mp3");

			//Wrong Guy	
			Crafty.sprite(81, 299, '../Hitman/img/man4.png', {s1:[0,0]});
			var suspect1 = Crafty.e('2D, Canvas, s1, Mouse')
				.attr({x: 65, y: 253, w: 38, h: 120})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("fail");
					}, 1600);
					
				});

			//Right Guy
			Crafty.sprite(81, 299, '../Hitman/img/man6.png', {s2:[0,0]});
			var suspect2 = Crafty.e('2D, Canvas, s2, Mouse')
				.attr({x: 390, y: 270, w:43, h:160})
				
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");					

					setTimeout(function() { 
						Crafty.scene("succes");
					}, 1600);
				});
			
			//Wrong Guy	
			Crafty.sprite(81, 299, '../Hitman/img/woman1.png', {s3:[0,0]});
			var suspect3 = Crafty.e('2D, Canvas, s3, Mouse')
				.attr({x: 910, y: 320, w: 90, h: 330})
				
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("fail");
					}, 1600);
				});
				
			//Car object	
			var car = Crafty.e("2D, DOM, Image")
				.image("../Hitman/img/car.png")
				.attr({x: 210, y: 325});

		});
		
		//Succes scene
		Crafty.scene("succes", function() {
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 450, y: 180})
				.text("MISSION PASSED")
				.textFont({size: '24px', family: 'Arial', weight: 'bold'})
				.textColor('white');
				
				setTimeout(function() { 
					window.location = "../Hitman/Hitman_2.html"
				}, 2000);		
		});
		
		//Fail scene
		Crafty.scene("fail", function() {
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 450, y: 180})
				.text("MISSION FAILED")
				.textFont({size: '24px', family: 'Arial', weight: 'bold'})
				.textColor('white');
				
				setTimeout(function() { 
					window.location = "../Hitman/Hitman_2.html"
				}, 2000);
		});

		
		//Start with loading scene first
		Crafty.scene("loading");
		
	});