/**
* Robbery game
* Crafty JS
* Author: Frank A. Verhagen
*/
var enemiesalive = 0;
Crafty.sprite(472,99, "bullet.png", {
    Bullet: [0,0]
});
        
        	Crafty.sprite(472,99, "gunfire.png", {
    Gunfire: [150,150]
});
        Crafty.sprite(350,350, "enemy.png", {
    EnemySprite: [0,0]
});
		Crafty.sprite(650,650, "gangster.png", {
    PlayerSprite: [0,0]
});
		Crafty.sprite(891, 150,"tram.png", {
		tram: [0,0]
		});
        Crafty.sprite(986, 487,"truck.png", {
		Truck: [0,0]
		});
        
        Crafty.sprite(128, 128,"tire.png", {
		Tire: [0,0]
		});
        Crafty.sprite(888,244,"building.png", {
    Building1: [0,0]
    });
var player;

		
        Crafty.defineScene("Scene1", function() {
		Crafty.init(1000, 600, document.getElementById('game'));
		Crafty.background('#FFFFFF url(bg.png) repeat');
		/* Block */

    player = getPlayer();


       
       
		var tram = spawnTram(1000, 129);
			
		
            
        		 
        SpawnEnemy(850, 300, true);
        SpawnEnemy(1500, 300, true);
        SpawnEnemy(1000, 100, false);
        SpawnEnemy(1200, 200, false);
		
 var truck = spawnObject(1200, 383, 246, 121, "Truck");
        var door = Crafty.e('2D, DOM, Color, Door').attr({x: 3326, y: 256+83, w: 80, h: 100}).color('#000000');
        door.z = 0;
                

        
var building1 = spawnObject(3000, 133,988,344, "Building1");
building1.z = 1;
function spawnObject(disx,disy,width, height, sprite){
               var objectfloor = Crafty.e('Floor, 2D, Canvas, Color, Floor')
		  .attr({x: disx+66, y: disy+10, w:width - player.w +24, h: 0});
              var object = Crafty.e('2D, Canvas,' + sprite)
		  .attr({x: disx, y: disy, w:width, h:height})
              return object;
        }

		   
  

        function SpawnEnemy(x, y, followplayer){

            var enemydirection = -1;
            var health = 3;
            enemiesalive++;
            var enemy = Crafty.e('2D, DOM, EnemySprite, Twoway, Gravity,SpriteAnimation, Collision, solid')

		  .attr({x: x, y: y, w:150, h: 150})
                        .collision([70,0,70,130,80,130,80,0])

		  .gravity('Floor')
        .gravityConst(1000)
        .reel('EnemyRunning', 1000, 0, 0, 5);
            enemy.checkHits('Enemy');
    enemy.onHit('Enemy', function(entity){


                    health--;
        
        enemyhealthbar.attr({w: health*20});
        var color = redYellowGreen(0, 100,health*20);
        enemyhealthbar.color(color);
            if(health < 1 ){
        this.destroy();
            }
    
                    entity[0].obj.destroy();
    });
                         var enemyhealthbar = gethealthbar(enemy);

                        		  var enemygunfire = getgunfire(enemy, enemydirection);

         
        enemy.bind("EnterFrame", function(eventData) {
                        
            var posx = enemy.x+10;

            if(enemy.x > player.x){
                    enemydirection = -1;
                                  posx = posx -340;

                                       enemygunfire.flip("X")

                                              enemy.flip("X");

        } else {
                                                                enemydirection = 1;
                                                enemygunfire.unflip("X")

         
            enemy.unflip("X");
        }
            if(eventData.frame % 100 == 0 
               && (-Crafty.viewport._x) < enemy.x +133
               && (-Crafty.viewport._x + (Crafty.viewport._width / Crafty.viewport._scale)) > enemy.x 
               && difference(player.y, enemy.y) < 200){
                
                shoot(enemy,enemydirection, enemygunfire, "Player")
            }
var distance = difference(player.x, enemy.x);
if(distance > 600 || distance < 250){
                enemy.velocity().x = 0;
            } 
            else 
            if(enemy.x > player.x && distance > 250 && followplayer){
                enemy.velocity().x = -160;
            } else if(enemy.x < player.x && distance > 250 && followplayer){
                                enemy.velocity().x = 160;

            }
                 
                 enemygunfire.attr({x: posx, y: enemy.y-28})

		  });
            enemy.bind("Move", function(oldPosition){
                       if(!enemy.isPlaying() && oldPosition._x != enemy.x){
            		  		  enemy.animate('EnemyRunning', 0.5, 0, 1, 6); // setup animation
                           
              
                 
		  }
             
                   });

        }
        
        

        
        
	     /* Floors */
		 Crafty.e('Floor, 2D, Canvas, Color, Persist')
		  .attr({x: 0, y: 500, w: 6000, h: 10})
         
         
Crafty.e("2D, DOM, Color, solid, left")
      .attr({x: -1, y: -200, w: 1, h: 646})
      .color();
        Crafty.e("2D, DOM, Color, solid, right")
      .attr({x: 6000, y: -200, w: 1, h: 646})
      .color();
		  
        
        
		  function spawnTram(disx, disy){
              var tramfloor = Crafty.e('Floor, 2D, Canvas, Color, Motion, Floor')
		  .attr({x: disx+55, y: disy+57+83, w: 770, h: 0})
              tramfloor.velocity().x = 80;
              
              var tram = Crafty.e('2D, Canvas, tram, Motion')
		  .attr({x: disx, y: disy+83})
		var speed = tram.velocity(); //returns the speed object
			speed.x = 80;   // set the speed in the x direction
              return tram;
              
          }
          
          
         
                   
                   Crafty.audio.add("shot", [
"shot.wav"
]);
        Crafty.audio.add('auw', [
            "auw.wav"
        ])
        
        
			 
        });
                Crafty.defineScene("Scene2", function() {
							Crafty.background('#FFFFFF url(indoorbg.png) repeat');
							Crafty.e("2D, DOM, Color, solid, left")

      .attr({x: -1, y: -200, w: 1, h: 646})
      .color();
        Crafty.e("2D, DOM, Color, solid, right")
      .attr({x: 1000, y: -200, w: 1, h: 646})
      .color();
      							player.x = 0;
});
		  		Crafty.enterScene("Scene1");
		  		
		  		
		  		
		  		
		  		
		  		
		  		function getPlayer() {

		  			var direction = 1; //direction 1 = right, 0 is left
        var playerhealth = 5;
		  			var player = Crafty.e('2D, DOM, PlayerSprite, Twoway, Gravity,SpriteAnimation, Collision, Keyboard, Persist, WiredHitBox')
		  .attr({x: 200, y: 350, w:150, h: 150})
		  .twoway(200)
		  .gravity('Floor')
        .gravityConst(1500)
        .bind("CheckLanding", function(ground) {
     if (player.y + player.h > ground.y + player.dy) { // forbid landing, if player's feet are not above ground
        player.canLand = false;
    }
});
		  		        var healthbar = gethealthbar(player);
player.origin("Center");
player.z = 200;

player.reel('PlayerRunning', 800, 1, 0, 6) // setup animation
           		  var gunfire = getgunfire(player, 1);
           		  gunfire.z = 3;
                        player.collision([95,0,95,134,50,134,50,80,70,0] );

player.bind('Moved', function(evt){

        if (this.hit('solid')){
          this[evt.axis] = evt.oldValue;
        }
      });

		  player.bind('KeyDown', function(e) {
    if(e.key == Crafty.keys.SPACE) {
        shoot(player, direction, gunfire, "Enemy")
    } 
    if(e.key == Crafty.keys.LEFT_ARROW || e.key == Crafty.keys.A){
        player.flip("X");
                                player.collision([83,0,95,134,50,134,58,0] );

        direction = -1;

    }
              if(e.key == Crafty.keys.RIGHT_ARROW || e.key == Crafty.keys.D){
        player.unflip("X");
                                          player.collision([95,0,95,134,50,134,50,80,70,0] );

        direction = 1;

    }
              
          });
        player.jumper(1000, ['UP_ARROW', 'W']);

    player.onHit('Player', function(entity){
if( difference(entity[0].obj.x, this.x) <100 ){
                    playerhealth--;
        healthbar.attr({w: playerhealth*20});
        var color = redYellowGreen(0, 100,playerhealth*20);
        healthbar.color(color);
        if(playerhealth < 1 ){
        this.destroy();
            }
    
                    entity[0].obj.destroy();
                    }
    });
    player.onHit('Door', function(entity){
				Crafty.enterScene("Scene2");
    });
     player.bind("Move", function(oldPosition) {
			  var posx = player.x;
                 if(direction == -1){
                  posx = posx -320;
                                       gunfire.flip("X")

              } else {
                                    gunfire.unflip("X")

              }
                 gunfire.attr({x: posx, y: player.y-27})
               var screenWidth = Crafty.viewport._width-300;
   
            Crafty.viewport.x = (this.x - (screenWidth / 2)) * -1;
            document.getElementById("game").style.backgroundPosition = Crafty.viewport.x + "px";
          
              
                 
                                                       
          var keydown = false;
              if(this.isDown('LEFT_ARROW') || this.isDown('RIGHT_ARROW')|| this.isDown('A')|| this.isDown('D')){
                  keydown =true;
              }
              
              
		  if(!player.isPlaying() && oldPosition._x != player.x && oldPosition._x < 5998 && oldPosition._x > 2 && keydown == true){
              
		  		  player.animate('PlayerRunning',1) // setup animation
                  
		  } 
              
          
});
        player.bind('EnterFrame', function(){
            if(!player.isPlaying()){
              player.sprite(0, 0);
          }
        });
        

        
return player;
		  		}
		  		
		  		function getgunfire(entity, firedirection){
            var gunfir = Crafty.e('2D, Canvas, Gunfire, SpriteAnimation, Motion')
                          		   gunfir.reel('Shot', 300, 0, 0, 2) // setup animation
           
            return gunfir;
                                   
        }
        function shoot(entity,bulletdirection, gunfire, victim){
                 var disx = entity.x;
                 var disy = entity.y;
                 
                 var hitcount = 0;

                 Crafty.audio.play("shot")
                 		  

                 gunfire.animate('Shot', 0.5, 0, 1, 1);
                 if(entity)
                 
                 var bullet = Crafty.e('2D, Canvas, Bullet, Motion, Collision')
                                  

                

                                  bullet.addComponent(victim);
                                  bullet.z =3;
                                  
                 
                 if(bulletdirection == 1){
		  disx = disx-300;
                 
                              bullet.flip("X")
                              
                          }  else{
                              		  disx = disx+30;

                          }
                 bullet.attr({x: disx, y: disy+44, w:400, h: 60});
		var speed = bullet.velocity(); //returns the speed object
			speed.x = 600 *bulletdirection;   // set the speed in the x direction
			bullet.bind("Move", function (oldPosition) {
				if(bullet.x < (-Crafty.viewport._x)-450 && bulletdirection == 1 
				|| bullet.x < (-Crafty.viewport._x)-10 && bulletdirection == -1
				|| bullet.x > (-Crafty.viewport._x + (Crafty.viewport._width / Crafty.viewport._scale)-337) && bulletdirection == 1){

				bullet.destroy();
				}
			});
                 
             }
               function redYellowGreen(min, max, value)
{
	var green_max = 220;
	var red_max = 220;
	var red = 0;
	var green = 0;
	var blue = 0;

	if (value < max/2)
	{
		red = red_max;
		green = Math.round((value/(max/2))*green_max);
	}
	else
	{
		green = green_max;
		red = Math.round((1-((value-(max/2))/(max/2)))*red_max);
	}
	return 'rgb('+red+','+green+','+blue+')';
}

		
		 


        function gethealthbar(entity){
            var bar = Crafty.e("2D, DOM, Color, right")
      .attr({x: entity.x, y: entity.y, w: 100, h: 10})
      .color('green');
            entity.bind('Move', function(evt){
                
                bar.attr({x: entity.x+30, y: entity.y-20})
                
            });
            return bar;
        }
        function difference (a, b){ return Math.abs(a - b)};

