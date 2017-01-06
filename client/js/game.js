
Crafty.init(1000,600, document.getElementById('game'));
  
 Crafty.defineScene("login", function() {
	 Crafty.background('url(client/img/menu_background.png)');
	
	 Crafty.e("2D, DOM, Text")
          .attr({x:365, y: 75, w:300 })
          .text("Mafia Gimma")
		  .textFont({ size: '40px', weight: 'bold' })
          .textColor("#FFFFFF")
		  .unselectable();

	 Crafty.e("2D, DOM, Text")
          .attr({w:150, x: 450, y: 250 })
          .text("Login")
		  .textFont({ size: '28px', weight: 'bold' })
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
 
 Crafty.defineScene("thegame", function() {
	 
	// Crafty.sprite("client/img/gtasprite.png", {Player:[0,0]});
	 
	// var player = Crafty.e("2D, Canvas, Fourway, Player")
	// .attr({x:250, y:250})
	// .crop(31,297,39,69)
	// .fourway(100)
	// .bind("KeyDown", function(e){
		// if(this.isDown(65)){
			// Crafty.e('2D, DOM, Color')
			// .attr({x: this.x+19.5, y: this.y+34.5, w: 5, h: 5})
			// .color('#F00');
	// }});
	
	// socket.on('newPosition'),function(data){
		// console.log("test");
	// };
	
	// .bind("KeyDown", function(e) {
		// while(this.isDown != null){
    // if(this.isDown(65) && this.isDown(87)) {
		// this.fourway(50);
		// this.color("blue");
	// } else if (this.isDown(65) && this.isDown(83)) {
		// this.fourway(50);
		// this.color("blue");
    // } else if (this.isDown(68) && this.isDown(83)) {
		// this.fourway(50);
		// this.color("blue");
    // } else if (this.isDown(68) && this.isDown(87)) {
		// this.fourway(50);
		// this.color("blue");
    // } else	{
		// player.fourway(100);
		// this.color("red");
		// }}});
		
		// //var mouseX = event.clientX
		// //var mouseY = event.clientY;
		// console.log(mouseX)
		
		  // var testText = Crafty.e("2D, DOM, Text, Motion")
		     // .attr({ x: 100, y: 100})
			 // .text(function () { return "My position is " + this._x });
			
			  // setInterval(function testTextFunction() {
				  // testText.text("mouse x = " + mouseX);
			  // },1000);
			 
			 
		
	 
	Crafty.background('#FFF000');	   
		   
	
	  
	  
	 
	 
 }); 
 
 Crafty.enterScene("login");
 
 Crafty.defineScene("menu", function() {
	 
	 // var hogertest = Crafty.e("2D, DOM, Text, Mouse")
          // .attr({x: 550, y: 450 })
          // .text("Hoger-Lager?")
		  // .textFont({ size: '45px', weight: 'bold' })
          // .css({ "text-align": "center"})
          // .textColor("#FFFFFF")
		  // .bind("MouseOver", function(){
			  // this._color = "rgba(255, 255, 255, 1)"
			// })
		  // .bind("MouseOut", function(){
			  // this._color = "rgba(255, 255, 0, 1)"
			// });
		
		// console.log(hogertest); 
		  
	 var parent = document.getElementById("game");
	 var usernameInput = document.getElementById("username");
	 var passwordInput = document.getElementById("password");
	 var signInButton = document.getElementById("signIn");
	 var registerButton = document.getElementById("register");
	 game.removeChild(usernameInput);
	 game.removeChild(passwordInput);
	 game.removeChild(signInButton);
	 game.removeChild(registerButton);
	 
	 Crafty.e("2D, Canvas, Image, Mouse")
	 .attr({x: 250,y: 100, w:200, h:200})
	 .image("client/img/hitman.png")
	 .bind("MouseOver", function(){
		 this.image("client/img/hitman_glow.png");
	 })
	 .bind("MouseOut", function(){
		 this.image("client/img/hitman.png");
	 })
	 .bind("Click", function(){
		 Crafty.enterScene("hitman");
	 });
	 
	 Crafty.e("2D, Canvas, Image, Mouse")
	 .attr({x: 550,y: 100, w:200, h:200})
	 .image("client/img/bankoverval.png")
	 .bind("MouseOver", function(){
		 this.image("client/img/bankoverval_glow.png");
	 })
	 .bind("MouseOut", function(){
		 this.image("client/img/bankoverval.png");
	 });
	  
	 Crafty.e("2D, Canvas, Image, Mouse")
	 .attr({x: 250,y: 400, w:200, h:200})
	 .image("client/img/duel.png")
	 .bind("MouseOver", function(){
		 this.image("client/img/duel_glow.png");
	 })
	 .bind("MouseOut", function(){
		 this.image("client/img/duel.png");
	 });
	 
	 Crafty.e("2D, Canvas, Text")
	 .attr({x: 550, y: 450 })
     .text("Hoger-Lager?")
     .textFont({ size: '45px', weight: 'bold' })
     .textColor("#FFFFFF");
	 
	 var onlinePlayersText = Crafty.e("2D, Canvas, Text")
	 .attr({x: 0, y: 0 })
     .text(function () { return "Online Players: " + onlinePlayers})
     .textFont({ size: '20px', weight: 'bold' })
     .textColor("#FFFFFF");
	 
	  setInterval(function onlinePlayersTextFunction() {
		onlinePlayersText.text("Online Players: " + onlinePlayers);
	  },1000);
		   
		
		   
		   
	  
	  
	 
	 
Crafty.background('url(client/img/menu_background.png)');
 
 });
 // var testText = Crafty.e("2D, DOM, Text, Motion")
		    // .attr({ x: 100, y: 100, vx: 10 })
			// .text(function () { return "My position is " + this._x });
			
			 // setInterval(function testTextFunction() {
				 // testText.text(Math.floor(testText.x));
			 // },1000);
 
 
 