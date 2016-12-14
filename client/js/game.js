
Crafty.init(500,500, document.getElementById('game'));
  
 Crafty.defineScene("login", function() {
	 Crafty.background('#000');
	
	 Crafty.e("2D, DOM, Text")
          .attr({x: 200, y: 120 })
          .text("Mafia Gimma")
		  .textFont({ size: '20px', weight: 'bold' })
          .css({ "text-align": "center"})
          .textColor("#FFFFFF")
		  .unselectable();

		  Crafty.e("2D, DOM, Text")
          .attr({w:150, x: 170, y: 200 })
          .text("Please login to continue")
		  .textFont({ size: '14px', weight: 'bold' })
          .css({ "text-align": "center"})
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
	 
	Crafty.sprite("client/img/gtasprite.png", {Player:[0,0]});
	 
	var player = Crafty.e("2D, Canvas, Fourway, Player")
	.attr({x:250, y:250})
	.crop(31,297,39,69)
	.fourway(100);
	
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
 
 Crafty.enterScene("thegame");
 
 Crafty.defineScene("menu", function() {
	 
	 Crafty.e("2D, DOM, Text")
          .attr({x: 200, y: 120 })
          .text("Welcome")
		  .textFont({ size: '20px', weight: 'bold' })
          .css({ "text-align": "center"})
          .textColor("#FFFFFF")
		  .unselectable();
		  
	 var parent = document.getElementById("game");
	 var usernameInput = document.getElementById("username");
	 var passwordInput = document.getElementById("password");
	 var signInButton = document.getElementById("signIn");
	 var registerButton = document.getElementById("register");
	 game.removeChild(usernameInput);
	 game.removeChild(passwordInput);
	 game.removeChild(signInButton);
	 game.removeChild(registerButton);
		   
		   
	
		
		   
		    // var testText = Crafty.e("2D, DOM, Text, Motion")
		    // .attr({ x: 100, y: 100, vx: 10 })
			// .text(function () { return "My position is " + this._x });
			
			 // setInterval(function testTextFunction() {
				 // testText.text(Math.floor(testText.x));
			 // },1000);
	  
	  
	 
	 
 Crafty.background('#FFF000');});

 
 
 