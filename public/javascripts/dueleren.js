Crafty.init(1000,600, document.getElementById('game'));



Crafty.defineScene("dueleren", function() {
	socket.emit('JoinDueleren');
	var random = Math.random();
	var socketID; 
	var player_list = {};
	var bullet_list = {};
	var clientPlayer;
	
	Crafty.sprite(75, 96, "img/playersprite.png", {Player:[0,0]})
	var bg = Crafty.e('2D, Canvas, Image')
    .attr({x: 0,y: 0, w:3200, h:3200})
	.image("img/background_dueleren.png");
	
	
	class Bullet {
		constructor(data){
			this._id = data.id;
			this._bullet = new Crafty.e("2D, Canvas, Image, Collision")
			.attr({x:data.x, y:data.y, w:10, h:10})
			.image("img/bullet.png", "repeat");
		}
	}
	
	class testPlayer {
		constructor(id,angle){
			this._id = id;
			this._player = Crafty.e('2D, Collision')
			.attr({x:0, y:0, w:75, h:96});
			
			
			this._body = 
				Crafty.e("Canvas, Player, SpriteAnimation")
               .attr({x: this._player.x-(75/2), y: this._player.y-(96/2)}) // offsets from local center
               .reel('PlayerRunning', 1250, 0, 0, 6)
			   .reel('PlayerIdle', 1250, 0, 0, 1)
			   .reel('PlayerShoot', 1250, 6, 0, 1)
			   .animate('PlayerRunning', -1);
				
			
			
			this._healthbar = 
				Crafty.e("2D, Canvas, Color")
				.attr({x: this._player.x-(75/2), y: this._player.y-60, w:75, h:5})
				.color("green");
				
			this._healthbarRed =
				Crafty.e("2D, Canvas, Color")
				.attr({x: this._player.x-(75/2), y: this._player.y-60, w:0, h:5})
				.color("red");
			
			
			this._player.attach(this._body);
			this._body.attach(this._healthbar);
			this._body.attach(this._healthbarRed);
			
			this._body.pauseAnimation();
			this.state;
			this._player.rotation = angle;

		}
		checkState(state){
				if(state == "up-right"){
					this._body.resumeAnimation();
					this._player.rotation = 45;
					//this._healthbar.rotation = -45;
				}else if(state == "up-left"){
					this._body.resumeAnimation();
					this._player.rotation = 315;
					//this._healthbar.rotation = -45;
				}else if(state == "down-right"){
					this._body.resumeAnimation();
					this._player.rotation = 135;
					//this._healthbar.rotation = -45;
				}else if(state == "down-left"){
					this._body.resumeAnimation();
					this._player.rotation = 225;
					//this._healthbar.rotation = -45;
				}else if(state == "right"){
					this._body.resumeAnimation();
					this._player.rotation = 90;
					//this._healthbar.rotation = -45;
				}else if(state == "left"){
					this._body.resumeAnimation();
					this._player.rotation = 270;
					//this._healthbar.rotation = -45;
				}else if(state == "up"){
					this._body.resumeAnimation();
					this._player.rotation = 0;
					//this._healthbar.rotation = -45;
				}else if(state == "down"){
					this._body.resumeAnimation();
					this._player.rotation = 180;
					//this._healthbar.rotation = -180;
				}else if(state == "none"){
					this._body.animate('PlayerRunning', -1);
					this._body.reelPosition(6);
				}else if(state == "shoot"){
					this._body.animate('PlayerShoot', -1);
				}
			}
			
		checkHealth(health){
			if(health == 5){
				this._healthbarRed._w = 0;				
			} else if(health == 4){
				this._healthbarRed._w = 15;				
			} else if(health == 3){
				this._healthbarRed._w = 30;				
			} else if(health == 2){
				this._healthbarRed._w = 45;				
			} else if(health == 1){
				this._healthbarRed._w = 60;				
			} else if(health == 0){
				this._healthbarRed._w = 75;				
			}
				
		}
	}
	
			Crafty.viewport.clampToEntities = false;
			
	
	function createPlayers(data){
		if(player_list[data.id] === undefined)
		{
		var player = new testPlayer(data.id, data.angle);
		player_list[data.id] = player;
		console.log("NEW PLAYER CREATED WITH ID " + data.id);
		}
		else{
		var player = player_list[data.id];
		player.checkState(data.state);
		player.checkHealth(data.hp);
		player._player.x = data.x;
		player._player.y = data.y;
		}
	};
	
	function createBullets(data){
		if(bullet_list[data.id] === undefined){

			var bullet = new Bullet(data);
			bullet_list[data.id] = bullet;
		}
		else{
		var bullet = bullet_list[data.id];
		bullet._bullet.x = data.x;
		bullet._bullet.y = data.y;
	}};
	
	socket.on('onConnect', function(data){
		socketID = data;
		
		console.log(socketID);
	});
	
	
	socket.on('newPositions',function(data){
		for(var i = 0 ; i < data.length; i++){
		createPlayers(data[i]);
		}
	});
	
	socket.on('bulletPositions',function(data){
		for(var i = 0 ; i < data.length; i++){
		createBullets(data[i]);
		}
	});
	
	socket.on('BulletRemove',function(data) {
		bullet_list[data]._bullet.destroy();
		delete bullet_list[data];
	});
	
	
	socket.on('PlayerRemove',function(data){
		console.log(data + " succesfully dereted");
		player_list[data]._player.destroy();
		delete player_list[data];
	});
	
	socket.on('LeaveScene' , function(){
		Crafty.enterScene("Duel_Lose");
	});
	
	
	
	function playerAngle(){
			if(player_list[socketID] !== undefined){
			var angle = player_list[socketID]._player.rotation;
			socket.emit('playerAngle',angle);
			}
		}
		

	var keys = [];
	mouse = false;
		
	document.onkeydown = function(event){
		Crafty.viewport.follow(player_list[socketID]._player,  75/2, 96/2);
		keys[event.keyCode] = true;
	}
	
	document.onkeyup = function(event){
		keys[event.keyCode] = false;
	}
	
	
	// document.onmousedown = function(event){
		// socket.emit('keyPress',{inputId:'shoot', state:false});
		// keys[mouse] = true;
	// }
	
	// document.onmouseup = function(event){
		// keys[mouse] = false;
	// }
  
	function update(){
		if(keys[87] && keys[68]){ //w + d
			socket.emit('keyPress',{inputId:'up-right'});
		} else if(keys[87] && keys[65]){ //w + a
			socket.emit('keyPress',{inputId:'up-left'});
		} else if(keys[83] && keys[68]){ //s + d
			socket.emit('keyPress',{inputId:'down-right'});
		} else if(keys[83] && keys[65]){ //s + a
			socket.emit('keyPress',{inputId:'down-left'});
		} else if(keys[87]){ // w	
            socket.emit('keyPress',{inputId:'up'});
		} else if(keys[65]){ // a
            socket.emit('keyPress',{inputId:'left'});
		} else if(keys[83]){ // s
            socket.emit('keyPress',{inputId:'down'});
		} else if(keys[68]){ // d
            socket.emit('keyPress',{inputId:'right'});
		} else if(keys[32]){ // space
			socket.emit('keyPress',{inputId:'shoot'});
		}
		else {
			socket.emit('keyPress',{inputId:'none'});
		}
		
		playerAngle();
		
		
		
		window.requestAnimationFrame(update)
	}
	
	window.requestAnimationFrame(update)
	setTimeout(function() {
	Crafty.viewport.follow(player_list[socketID]._player,  75/2, 96/2)}
	, 500);
});

class Player {
	constructor(id){
		this._id = id;
		this._x = 0;
		this._y = 0;
		this._hp = 5;
		console.log("Player has been created with id " + this._id);
	}
	
	updatePosition(x,y){
		this._x = x;
		this._y = y;
	}
	
	getPosition(){
		x = this._x;
		y = this._y;
		return {
			x:x,
			y:y
		};
	}	
}

Crafty.defineScene("Duel_Lose", function(){
	var bg = Crafty.e('2D, Canvas, Image')
    .attr({x: 0,y: 0, w:1000, h:650})
	.image("img/thisisyou.jpg");
	
	socket.emit('punishUser', {
					username: usernameText.value,
					amount: 500
				});
	
	var loserText = Crafty.e("2D, Canvas, Text")
		.attr({
			x: 0,
			y: 0
		})
		.text("You just lost 500 bucks bro")
		.textFont({
			size: '40px',
			weight: 'bold'
		})
		.textColor("#FFF)00");
	
	setTimeout(function(){
		Crafty.enterScene("menu");
	}, 2500);

});
