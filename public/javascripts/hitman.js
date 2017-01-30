
			Crafty.init(1000, 600, document.getElementById('game'));
			
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
				Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 510, y: 200})
					.text("MISSION")
					.textFont({size: '22px', family: 'Arial', weight: 'bold'})
					.textColor('white');
				
				// Text
				Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 325, y: 280})
					.text("My accountant stole all my money. Take him out!")
					.textFont({size: '20px', family: 'Arial', weight: 'bold'})
					.textColor('white');

			});

			//Main scene
			Crafty.scene("main",function() {
				Crafty.background('#FFFFFF url(./images/bg_level1.png) no-repeat center center');
				
				Crafty.audio.add("shoot", "./sounds/gun.mp3");

				//Wrong Guy	
				Crafty.sprite(81, 299, './images/man4.png', {s1:[0,0]});
				var suspect1 = Crafty.e('2D, Canvas, s1, Mouse')
					.attr({x: 65, y: 283, w: 38, h: 120})
					.bind('Click', function(MouseEvent){
						Crafty.audio.play("shoot");
						
						setTimeout(function() { 
							Crafty.scene("fail");
						}, 1600);
						
					});

				//Right Guy
				Crafty.sprite(81, 299, './images/man6.png', {s2:[0,0]});
				var suspect2 = Crafty.e('2D, Canvas, s2, Mouse')
					.attr({x: 390, y: 290, w:43, h:160})
					
					.bind('Click', function(MouseEvent){
						Crafty.audio.play("shoot");					

						setTimeout(function() { 
							Crafty.scene("succes");
						}, 1600);
					});
				
				//Wrong Guy	
				Crafty.sprite(81, 299, './images/woman1.png', {s3:[0,0]});
				var suspect3 = Crafty.e('2D, Canvas, s3, Mouse')
					.attr({x: 910, y: 350, w: 90, h: 330})
					
					.bind('Click', function(MouseEvent){
						Crafty.audio.play("shoot");
						
						setTimeout(function() { 
							Crafty.scene("fail");
						}, 1600);
					});
					
				//Car object	
				var car = Crafty.e("2D, Canvas, Image")
					.image("./images/car.png")
					.attr({x: 210, y: 355});

			});
			
			//Succes scene
			Crafty.scene("succes", function() {
			
				Crafty.background("#000");
				
				// Text
				Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 470, y: 280})
					.text("MISSION PASSED")
					.textFont({size: '24px', family: 'Arial', weight: 'bold'})
					.textColor('white');
					
				
				setTimeout(function() {
					getReward();
					Lvl2();
					
				}, 2000);

				
			});
			
			//Fail scene
			Crafty.scene("fail", function() {
			
				Crafty.background("#000");
				
				// Text
				Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 470, y: 280})
					.text("MISSION FAILED")
					.textFont({size: '24px', family: 'Arial', weight: 'bold'})
					.textColor('white');
									
				
				setTimeout(function() { 
					Lvl2();
				}, 2000);
				
			});

			
			//Start with loading scene first
			Crafty.scene("loading");
			
		});

	function Lvl2(){
		Crafty.init(1000, 600, document.getElementById('game'));

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
		Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 510, y: 200})
			.text("MISSION")
			.textFont({size: '22px', family: 'Arial', weight: 'bold'})
			.textColor('white');
		
		// Text
		Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 200, y: 280})
			.text("My crazy ex is stalking me, I can't even leave my house! Take her out will you!")
			.textFont({size: '20px', family: 'Arial', weight: 'bold'})
			.textColor('white');

		});

		//Main scene
		Crafty.scene("main",function() {
			Crafty.background('#FFFFFF url(./images/bg_level2.png) no-repeat center center');
			
			Crafty.audio.add("shoot", "./sounds/gun.mp3");

			//Right Guy	
			Crafty.sprite(95, 252, './images/woman4.png', {s1:[0,0]});
			var suspect1 = Crafty.e('2D, Canvas, s1, Mouse')
				.attr({x: 69, y: 240, w: 47, h: 125})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("end");
					}, 1600);
					
				});

			//Wrong Guy
			Crafty.sprite(95, 252, './images/woman3.png', {s2:[0,0]});
			var suspect2 = Crafty.e('2D, Canvas, s2, Mouse')
				.attr({x: 415, y: 175, w:56, h:150})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");					

					setTimeout(function() { 
						Crafty.scene("end");
					}, 1600);
				});
			
			//Wrong Guy	
			Crafty.sprite(81, 299, './images/man3.png', {s3:[0,0]});
			var suspect3 = Crafty.e('2D, Canvas, s3, Mouse')
				.attr({x: 910, y: 320, w: 90, h: 310})
				.bind('Click', function(MouseEvent){
					Crafty.audio.play("shoot");
					
					setTimeout(function() { 
						Crafty.scene("end");
					}, 1600);
				});
	
		});
		


		//End scene
		Crafty.scene("end", function() {
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 390, y: 280})
				.text("THANK YOU FOR PLAYING!")
				.textFont({size: '24px', family: 'Arial', weight: 'bold'})
				.textColor('white');

			getReward();
		
		});

		
		//Start with loading scene first
		Crafty.scene("loading");
		
	});

	}
	

	<!-- AJAX POST : Reward player -->
	function getReward(){
		$.ajax({ 
			url: '/reward',
			type: 'POST',
			cache: false, 
			data: { player: $("#usernameText").val()}, 
		        success: function(data) {
		          console.log(data);
		          console.log('process sucess');
		       },
		        error: function() {
		          console.log('process error');
		        }
		})
	}
