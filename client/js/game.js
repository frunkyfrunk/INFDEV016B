
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
 
 Crafty.enterScene("login");
 
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
		   
		   
	
		
		   
		    Crafty.e("2D, DOM, Text, Motion")
		    .attr({ x: 100, y: 100, vx: 10 })
      	    .text(function () { return "My position is " + this._x })
			.dynamicTextGeneration(true);
	  
	  
	 
	 
 Crafty.background('#FFF000');});
 
 
 
 