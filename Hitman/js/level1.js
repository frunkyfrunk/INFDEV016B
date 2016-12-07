	jQuery(document).ready(function($){

	
	
	//Loading scene
		Crafty.scene("loading", function() {
		// Load our assets
		Crafty.load([], function() {
			setTimeout(function() { 
				Crafty.scene("main"); // Play the main scene
			}, 6000);
		});
		
			Crafty.background("#000");
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 490, y: 100})
				.text("MISSION")
				.textFont({size: '22px', family: 'Arial', weight: 'bold'})
				.textColor('white');
			
			// Text
			Crafty.e("2D, Canvas, Text").attr({w: 200, h: 50, x: 220, y: 180})
				.text("There's this guy who owes me some money. Take him out, will ya!")
				.textFont({size: '20px', family: 'Arial', weight: 'bold'})
				.textColor('white');

		});

		//Main scene
		Crafty.scene("main",function() {
			Crafty.background("#FFF");
			
			var red = Crafty.e('2D, DOM, Color, Mouse')
				.attr({x: 120, y: 150, w: 100, h: 100})
				.color('#ff0000')
				.bind('Click', function(MouseEvent){
					alert('You killed the wrong guy!', MouseEvent);
				});

			
			var blue = Crafty.e('2D, DOM, Color, Mouse')
				.attr({x: 490, y: 150, w: 100, h: 100})
				.color('#0059b3')
				.bind('Click', function(MouseEvent){
					alert('You killed the right guy!', MouseEvent);
				});
			
			var green = Crafty.e('2D, DOM, Color, Mouse')
				.attr({x: 860, y: 150, w: 100, h: 100})
				.color('#00d900')
				.bind('Click', function(MouseEvent){
					alert('You killed the wrong guy!', MouseEvent);
				});
				

			});

		
		//Start with loading scene first
		Crafty.scene("loading");
		
	});