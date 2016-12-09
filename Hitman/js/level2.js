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
		Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 195, y: 180})
			.text("My crazy ex is stalking me, I can't even leave my house! Take her out will you!")
			.textFont({size: '20px', family: 'Arial', weight: 'bold'})
			.textColor('white');

		});

		//Main scene
		Crafty.scene("main",function() {
			Crafty.background('#FFFFFF url(../Hitman/img/bg_level2.png) no-repeat center center');
			
			Crafty.audio.add("shoot", "../Hitman/sounds/gun.mp3");

			//Wrong Guy	
			Crafty.sprite(95, 252, '../Hitman/img/woman4.png', {s1:[0,0]});
			var suspect1 = Crafty.e('2D, Canvas, s1, Mouse')
				.attr({x: 69, y: 240, w: 47, h: 125})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("fail");
					}, 1600);
					
				});

			//Right Guy
			Crafty.sprite(95, 252, '../Hitman/img/woman3.png', {s2:[0,0]});
			var suspect2 = Crafty.e('2D, Canvas, s2, Mouse')
				.attr({x: 415, y: 175, w:56, h:150})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");					

					setTimeout(function() { 
						Crafty.scene("succes");
					}, 1600);
				});
			
			//Wrong Guy	
			Crafty.sprite(81, 299, '../Hitman/img/man3.png', {s3:[0,0]});
			var suspect3 = Crafty.e('2D, Canvas, s3, Mouse')
				.attr({x: 910, y: 320, w: 90, h: 310})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("fail");
					}, 1600);
				});
	
		});
		
		//Succes scene
		Crafty.scene("succes", function() {
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 450, y: 180})
				.text("MISSION PASSED")
				.textFont({size: '24px', family: 'Arial', weight: 'bold'})
				.textColor('white');
		
		});
		
		//Fail scene
		Crafty.scene("fail", function() {
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 450, y: 180})
				.text("MISSION FAILED")
				.textFont({size: '24px', family: 'Arial', weight: 'bold'})
				.textColor('white');
		
		});

		
		//Start with loading scene first
		Crafty.scene("loading");
		
	});
