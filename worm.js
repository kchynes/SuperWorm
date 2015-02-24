$(document).ready(function(){

	// Set Clock
	var timer = 0;
	setInterval(function(){
			timer++;
			document.getElementById("timeText").innerHTML = timer;
		}, 1000);
	
	var keys = [];
	window.addEventListener("keydown",
		function(e){
			keys[e.keyCode] = true;
			switch(e.keyCode){
				case 37: case 39: case 38: case 40: // Arrow Keys
				case 32: e.preventDefault(); break; // Space
			}
		},
		false);

	window.addEventListener('keyup',
		function(e){
			keys[e.keyCode] = false;
		},
		false);

		// Canvas Variables
		var canvas = $("#canvas")[0];
		var ctx = canvas.getContext("2d");
		var w = $("#canvas").width();
		var h = $("#canvas").height();

		// Game Variables
		var wormWidth = 10;
		var direction;
		var foodAmount;
		var food = [];
		var streakNum;
		var score;
		var highScore;
		var count = 0;
		var wormLength;
		var wormCut;
		var snakeColor;
		var foodColor = "#06f";
		var power = false;
		var cutPercent = 0.3;
		var theme = document.getElementById("themeSong");
		var mult = 1;
		var factArray = new Array("A worm has no arms, but has elbows.", 
			"In one acre of land, there can be more than a million earthworms.",
			"Worms can eat their weight each day, but will purge to maintain their figure.", 
			"This game has nothing to do with worms, beside the name.", 
			"A worm is like a snake, but weirder.", 
			"Worms feed off the aura of dead pandas.", 
			"60% of a worms body composition is actually horse DNA.", 
			"In Soviet Russia worms are domesticated pets.",
			"Worms have a raging addiction to Oreo cookies.",
			"A worm insurance is known for its dental care.",
			"In latin, worm means \"To steal thy neighbors poncho\"",
			"Wormstradomus predicts that global composting will reach an all time high by year 2020.",
			"Worm, proudly sponsored by John Deere equipment - \"If it ain't worm, it ain't Deere.\"",
			"This theme song brought to you by the wonderful Sycamore Drive - City Sounds!",
			"A worm will chew its nails when it's nervous.",
			"Typically a worm loses job interviews 9 times out of 10 because of the economy.",
			"If you place a worm on top of a cat, it will most likely die.");

		// Worm Body
		var worm_body;

		// Game start
		function init(){
			direction = "down";
			snakeColor = "white";
			createWorm();
			createFood(-1);

			// Setup new game variables
			score = 0;
			timer = 0;
			foodAmount = 2;
			wormCut = 0;
			mult = 1;
			streakNum = 0;
			calcMult(0);
			streak();
			printFact();
			foodColor = "#06F";
	        cutPercent = 0.3;
			document.getElementById("timeText").value = timer;

			if(typeof game_loop != "undefined")
				clearInterval(game_loop);

			// Game refreshes every 60 milliseconds
			game_loop = setInterval(paint, 60);
		}// init()

		init();

		// Creates the worm
		function createWorm(){
			var length = 5;
			worm_body = [];

			for (var i = length -1; i >= 0; i--) {
				worm_body.push({
					x: 35,
					y: i
				});
			}// for
		}// createWorm()

		// Create food for worm
		function createFood(num) {
	   		if(num == -1){
	   			food[0] = {
	                x: Math.round(Math.random() * (w - wormWidth) / wormWidth),
	                y: Math.round(Math.random() * (h - wormWidth) / wormWidth),
	            };
	            food[1] = {
	                x: Math.round(Math.random() * (w - wormWidth) / wormWidth),
	                y: Math.round(Math.random() * (h - wormWidth) / wormWidth),
	            };
	   		}
	   		else{
		        food[num] = {
		                x: Math.round(Math.random() * (w - wormWidth) / wormWidth),
		                y: Math.round(Math.random() * (h - wormWidth) / wormWidth),
		            };
	        }
		}// createFood()

		function paint(){

			// Paint Canvas
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, w, h);
			ctx.stokeStyle = "white";
			ctx.strokeRect(0, 0, w, h);

			// Finds the head of the worm
			var nx = worm_body[0].x;
			var ny = worm_body[0].y;

			// Direction the Worm is moving
			if(direction == "right") nx++;
			else if(direction == "left") nx--;
			else if(direction == "up") ny--;
			else if(direction == "down") ny++;

			// Check for failure
			if(nx == -1 || nx == w / wormWidth || ny == -1 || ny == h / wormWidth || checkCollision(nx, ny, worm_body)){
				// Add and print scores
				printScores();

				// Restart Worm
				init();
				return;
			}// if

   			for(i = 0; i < food.length; ++i){
	   			if (nx == food[i].x && ny == food[i].y) {
			           var tail; 
			           wormLength = worm_body.length;
			           for(var j = 0; j < (worm_body.length*cutPercent); ++j){
			           		tail = worm_body.pop(); 
			        	}
				            wormCut = wormLength - worm_body.length;
				            calcMult(wormCut);
				            tail.x = nx;
				            tail.y = ny;

				            score = parseInt((timer*((5/worm_body.length)*worm_body.length)*mult)+score);
				            createFood(i);
				            streakNum++;
				            streak();
	   				}
   				else{
					var tail = {
						x: nx,
						y: ny
					};
					if(count > 1){
						tail = worm_body.pop();

						tail.x = nx;
						tail.y = ny;
						count = 0;
					}// if
					else{
						count++;

						tail.x = nx;
						tail.y = ny;
					}// else
				}// else
   			}

			worm_body.unshift(tail);

			//Paints the worm cells
			for (var i = 0; i < worm_body.length; i++) {
            	var c = worm_body[i];
            	//Lets paint 10px wide cells
            	paintCell(c.x, c.y, "c");
       		}

       		//Paints each food in the array
   			for(i = 0; i <food.length; ++i){
   				paintCell(food[i].x, food[i].y, "f");
   			}
       		var scoreText = "Score: "+score;
       		ctx.font = 'normal 1em Arial';
       		ctx.fillStyle = "white";
       		ctx.fillText(scoreText, 3, h-5);
		}// paint()

		//paints the cells of the worm and food
		function paintCell(x, y, z){
			if(z == "f"){
				ctx.fillStyle = foodColor;
			}
			else{
				ctx.fillStyle = snakeColor;
			}

			ctx.fillRect(x * wormWidth, y * wormWidth, wormWidth, wormWidth);
			ctx.strokeStyle = "black";
			ctx.strokeRect(x * wormWidth, y * wormWidth, wormWidth, wormWidth);
		}// paintCell()


		//CHeck to see if the worm has touched a wall or itself
		function checkCollision(x, y, array){
			for (var i = 0; i < array.length; i++) {
            	if (array[i].x == x && array[i].y == y) return true;
        	}// for
        	return false;
		}// checkCollision()

		//Calculates the multiplier earned by the player
		function calcMult(wc){
			mult+=wc;
			document.getElementById("multText").innerHTML ="x"+mult;
		}// calcMult()

		//Prints the highest scores accumulated by the player
		function printScores(){
	        if(parseInt(document.getElementById("scoreText").value) < score)	
	        	document.getElementById("scoreText").value = score;
		}// printScores()

		function streak(){
			if(streakNum == 40){
				document.getElementById("streak").innerHTML = "Worm Master !!!";
				snakeColor = "yellow";
				clearInterval(game_loop);
				game_loop = setInterval(paint, 30);
			}
			else if(streakNum == 30){
				document.getElementById("streak").innerHTML = "Ultra  Combo ! ! !";
				theme.volume = 0.3;
				document.getElementById("uc").volume = 1.0;
				document.getElementById("uc").play();
				power = true;
			}
			else if(streakNum == 20){
				document.getElementById("streak").innerHTML = "RAMPAGE ! ! !";
				theme.volume = 0.3;
				document.getElementById("ram").play();
				power = true;
			}
			else if(streakNum == 10){
				document.getElementById("streak").innerHTML = "Holy Shit ! ! !";
				theme.volume = 0.3;
				document.getElementById("holy").play();
				power = true;
			}
			else
				document.getElementById("streak").innerHTML = "Get Small!";


			setTimeout(function(){theme.volume = 1.0;}, 6000);
		}// streak()

		function printFact(){
			var num = Math.floor((Math.random()*(factArray.length-1))+1);
			document.getElementById("wFact").innerHTML = factArray[num];
		}

		// Keyboard controls
		$(document).keydown(function(e) {
	        var key = e.which;
	        
	        if (key == "37" && direction != "right") direction = "left";
	        else if (key == "38" && direction != "down") direction = "up";
	        else if (key == "39" && direction != "left") direction = "right";
	        else if (key == "40" && direction != "up") direction = "down";
	        else if(key == "32" && power) {
	        	colorChange = setInterval(function(){if(foodColor == "#06f")foodColor = "red";else foodColor = "#06f";}, 100);
	        	cutPercent = 5;
	        	theme.pause();
				document.getElementById("cant").play();
	        	setTimeout(function(){foodColor = "#06f"; cutPercent = 0.3;document.getElementById("cant").pause();theme.play(); clearInterval(colorChange);}, 5000);
	        	power = false;
	        }
    })
});// JavaScript Document