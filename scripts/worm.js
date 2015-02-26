// Canvas Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// Worm Body
var _WORM = []; 
var _FOOD = [];

// Theme Colors ordered by Worm Color, Food Color, and Background Color
var _THEMES	=  [["#ecf0f1", "#3498db", "#000000"], // Basic
				["#cbcad0", "#81c142", "#0f7d0d"], // Bone
				["#e91a0a", "#ffffff", "#000000"], // Gears
				["#505e82", "#a2b7dc", "#13263e"], // Halo
				["#FFFFFF", "#DB0A5B", "#1abc9c"], // Hotline
				["#e74c3c", "#2980b9", "#FFFFFF"], // Inverse
				["#e91a0a", "#331f82", "#816830"], // Legend
				["#000000", "#999999", "#FFFFFF"], // Retro
				["#ffffff", "#0072bb", "#222b6c"], // Station
				["#e67e22", "#27ae60", "#2980b9"], // Sunset
				["#d35400", "#f1c40f", "#f39c12"]];// Sunrise

// Config Object
var _CONFIG = {
	wormWidth: 25,
	wormLength: 5,
	wormReduction: 0.3,
	wormGrowth: 0,
	wormGrowthLimit: 5,
	wormColor: _THEMES[0][0],
	foodAmount: 3,
	foodColor: _THEMES[0][1],
	bgColor: _THEMES[0][2],
	multIncrement: 5,
	multMessage: "GET SMALL!",
	streakIncrement: 1,
	speed: 70,
	seconds: 0,
	pause: true,
	timer: null,
	game: null,
	theme: document.getElementById("themeSong")
}

// Player Object
var _PLAYER = {
	score: 0,
	highScore: 0,
	power: false,
	mult: 1,
	streakCount: 0,
	direction: "down",
}

// Create Worm Fact Array
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
	"If you place a worm on top of a cat, it will most likely die.",
	"Worms are notorious for coding themselves into a rip off Snake game.",
	"Worms can be expensive... but they are not cheap either considering...");


// Game start
function init(){

	// Initialize Streak, Multiplier, Worm Color and Worm Facts
    calcMult(0)
    changeTheme();
    printWormFact();
    streak(_CONFIG.streakIncrement);

    // Create Worm and Food
    createWorm();
	createFood(-1);

	// Start Game Timer
	_CONFIG.timer = setInterval(function(){
					_CONFIG.seconds++;
					document.getElementById("timeText").innerHTML = _CONFIG.seconds;
				}, 1000);

	// Refresh the Game according to Game Speed
	_CONFIG.game = setInterval(paint, _CONFIG.speed);

}

// Ends Game and Resets Variables to Default
function gameOver(){

	clearInterval(_CONFIG.timer);
	clearInterval(_CONFIG.game);

	resetPlayer();
	resetConfig();
	_WORM = [];
	_FOOD = [];

	beginRestartCountdown();
	
}

// Puts the Player Object Back to default
function resetPlayer(){

	_PLAYER.highScore = _PLAYER.score;
	_PLAYER.score = 0;
	_PLAYER.power = false;
	_PLAYER.mult = 1;
	_PLAYER.streakCount = 0;
	_PLAYER.direction = "down"

}

// Resets Modifiable Config Settings
function resetConfig(){
	_CONFIG.wormReduction = 0.3;
	_CONFIG.wormGrowth = 0;
	_CONFIG.wormLength = 5;
	_CONFIG.seconds = 0;
}

function beginRestartCountdown(){
	// Pausing isn't allowed
	_CONFIG.pause = false;

	// Begin Countdown from 3
	var countdownTime = 3;
	document.getElementById("streak").innerHTML = countdownTime+"...";
	var countdown = setInterval(function(){
			countdownTime--;	
    		document.getElementById("streak").innerHTML = countdownTime+"...";
    		
    		if(countdownTime == 0){
				clearInterval(countdown);
				_CONFIG.pause = true;
				init();
    		}
	},1000);
}
// Creates the worm
function createWorm(){
	for (var i = _CONFIG.wormLength -1; i >= 0; i--) {
		_WORM.push({
			x: Math.round((w/2)/_CONFIG.wormWidth),
			y: i
		});
	}// for
}

// Create food for worm
function createFood(num) {

		// Create all Food Pellets
		if(num == -1)
			for(var i = 0; i < _CONFIG.foodAmount; ++i)
				createFoodLocation(i);
		// Create a new Food Pellet
		else
			createFoodLocation(num);
}

// Finds a valid X and Y coordinate for a Food Pellet
function createFoodLocation(index){

	// Location flag
	var invalidLocation = true;

	while(invalidLocation){
		// Assume the location will be Valid
		invalidLocation = false;

		// Get Random X and Y Coordinates
		var foodX_pos = Math.round(Math.random() * (w - _CONFIG.wormWidth) / _CONFIG.wormWidth);
		var foodY_pos = Math.round(Math.random() * (h - _CONFIG.wormWidth) / _CONFIG.wormWidth);

		// Loop through each worm piece for collision
		for(var i = 0; i < _WORM.length; i++)
			if(foodX_pos == _WORM[i].x && foodY_pos == _WORM[i].y)
				invalidLocation = true;
	}

	// Set Foods X and Y Coordinates
	_FOOD[index] = {
		x: foodX_pos,
		y: foodY_pos
	};

}

function paint(){

	// Paint Canvas
	ctx.fillStyle = _CONFIG.bgColor;
	ctx.fillRect(0, 0, w, h);
	ctx.stokeStyle = "white";
	ctx.strokeRect(0, 0, w, h);

	// Finds the head of the worm
	var nx = _WORM[0].x;
	var ny = _WORM[0].y;

	// Direction the Worm is moving
	if(_PLAYER.direction == "right") nx++;
	else if(_PLAYER.direction == "left") nx--;
	else if(_PLAYER.direction == "up") ny--;
	else if(_PLAYER.direction == "down") ny++;

	// Check for failure
	if(nx == -1 || nx == w / _CONFIG.wormWidth || ny == -1 || ny == h / _CONFIG.wormWidth || checkCollision(nx, ny, _WORM)){
		// Print Scores and End Game
		printScores();
		gameOver();
		return;
	}// if

	for(i = 0; i < _FOOD.length; ++i){
			if (nx == _FOOD[i].x && ny == _FOOD[i].y) {
	           var tail; 
	           wormLength = _WORM.length;
	           for(var j = 0; j < (_WORM.length*_CONFIG.wormReduction); ++j){
	           		tail = _WORM.pop(); 
	        	}
		            calcMult(_CONFIG.multIncrement);
		            tail.x = nx;
		            tail.y = ny;

		            _PLAYER.score = parseInt((_CONFIG.timer*((5/_WORM.length)*_WORM.length)*_PLAYER.mult)+_PLAYER.score);
		            createFood(i);
		            streak(_CONFIG.streakIncrement);
			}else{
			var tail = {
				x: nx,
				y: ny
			};
			if(_CONFIG.wormGrowth > _CONFIG.wormGrowthLimit){
				tail = _WORM.pop();

				tail.x = nx;
				tail.y = ny;
				_CONFIG.wormGrowth = 0;
			}// if
			else{
				_CONFIG.wormGrowth++;

				tail.x = nx;
				tail.y = ny;
			}// else
		}// else
	}// for

	_WORM.unshift(tail);

	//Paints the worm cells
	for (var i = 0; i < _WORM.length; i++) {
    	paintCell(_WORM[i].x, _WORM[i].y, "c");
	}

	//Paints each food in the array
	for(i = 0; i <_FOOD.length; ++i){
		paintCell(_FOOD[i].x, _FOOD[i].y, "f");
	}

	printScores();
}// paint()

//paints the cells of the worm and food
function paintCell(x, y, z){
	if(z == "f"){
		ctx.fillStyle = _CONFIG.foodColor;
	}
	else{
		ctx.fillStyle = _CONFIG.wormColor;
	}

	ctx.fillRect(x * _CONFIG.wormWidth, y * _CONFIG.wormWidth, _CONFIG.wormWidth, _CONFIG.wormWidth);
	ctx.strokeStyle = "black";
	ctx.strokeRect(x * _CONFIG.wormWidth, y * _CONFIG.wormWidth, _CONFIG.wormWidth, _CONFIG.wormWidth);
}// paintCell()



//Check to see if the worm has touched a wall or itself
function checkCollision(x, y, array){
	for (var i = 0; i < array.length; i++) {
    	if (array[i].x == x && array[i].y == y) return true;
	}// for
	return false;
}// checkCollision()

//Calculates the multiplier earned by the player
function calcMult(scoreAddition){
	_PLAYER.mult+=scoreAddition;
	if(_PLAYER.mult > 1)
		_PLAYER.mult -= (_PLAYER.mult%scoreAddition);

	document.getElementById("multText").innerHTML ="x"+_PLAYER.mult;
}// calcMult()

//Prints the current and high scores accumulated by the player
function printScores(){

	// Display Game Score
	var scoreText = "Score: "+_PLAYER.score;
	ctx.font = 'bold 1.2em Arial';
	ctx.fillStyle = _CONFIG.foodColor;
	ctx.fillText(scoreText, 5, h-5);
    
    // Display New High Score
    if(parseInt(document.getElementById("scoreText").value) < _PLAYER.score)	
    	document.getElementById("scoreText").value = _PLAYER.score;
}// printScores()

// Sets Streak depending on the streak number
function streak(i){

	// Increment the streak
	_PLAYER.streakCount += i;

	// Display Streak Notification
	if(_PLAYER.streakCount == 40){
		streakNotification(null, "Worm Master!!!", 0.3);
		_CONFIG.wormColor = "yellow";
		clearInterval(_CONFIG.loop);
		_CONFIG.speed = 45;
		_CONFIG.game = setInterval(paint, _CONFIG.speed);
	}
	else if(_PLAYER.streakCount == 30)
		streakNotification("uc", "Ultra Combo!!!", 0.3);
	else if(_PLAYER.streakCount == 20)
		streakNotification("ram", "RAMPAGE !!!", 0.3);
	else if(_PLAYER.streakCount == 10)
		streakNotification("holy", "Holy Shit!!!", 0.3);
	else
		streakNotification(null, "Get Small!", 0.0);
}// streak()

// Displays the Notification and the appropriate sound clip
function streakNotification(id, msg, volume){

	document.getElementById("streak").innerHTML = msg;
	_CONFIG.multMessage = msg;

	// If not default
	if(id != null){
		_CONFIG.theme.volume = volume;
		document.getElementById(id).volume = 1.0;
		document.getElementById(id).play();
		_PLAYER.power = true;

		// Reset Theme Volume after 6 seconds
		setTimeout(function(){
					_CONFIG.theme.volume = 1.0;
					_CONFIG.multMessage = "Press SPACE!";
					document.getElementById("streak").innerHTML = "Press SPACE!"
				}, 6000);
	}
}// streakNotification()

// Prints a new Worm Fact
function printWormFact(){
	var num = Math.floor((Math.random()*(factArray.length-1))+1);
	document.getElementById("wFact").innerHTML = factArray[num];
}

function changeTheme(){
		var colorIndex = document.getElementById("wormColor").selectedIndex-1;
		if(colorIndex >= 0){
			_CONFIG.wormColor = _THEMES[colorIndex][0];
			_CONFIG.foodColor = _THEMES[colorIndex][1];
			_CONFIG.bgColor   = _THEMES[colorIndex][2];
		}
		else {
			_CONFIG.wormColor = _THEMES[0][0];
			_CONFIG.foodColor = _THEMES[0][1];
			_CONFIG.bgColor   = _THEMES[0][2];
		}
}

function onWormColorChange(){
	changeTheme();
	document.getElementById("wormColor").blur();
}

function onVolumeControlClick(){
	if(_CONFIG.theme.volume == 0){
		_CONFIG.theme.volume = 1;
		document.getElementById("volumeControl").src = "./assets/volume_on.png";
	}else{
		_CONFIG.theme.volume = 0;
		document.getElementById("volumeControl").src = "./assets/volume_off.png";
	}
}
	

// Keyboard controls
$(document).keydown(function(e) {
    var key = e.which;
    
    if (key == 37 && _PLAYER.direction != "right") 
    	_PLAYER.direction = "left";
    else if (key == 38 && _PLAYER.direction != "down") 
    	_PLAYER.direction = "up";
    else if (key == 39 && _PLAYER.direction != "left") 
    	_PLAYER.direction = "right";
    else if (key == 40 && _PLAYER.direction != "up") 
    	_PLAYER.direction = "down";
    else if(key == 32 && _PLAYER.power) {
    	// Alternate Colors
    	var colorChange = setInterval(function(){
					    		if(_CONFIG.foodColor == "#06f")
					    			_CONFIG.foodColor = "red";
					    		else _CONFIG.foodColor = "#06f";}
					    	, 100);
    	
    	_CONFIG.wormReduction = 3;
    	_CONFIG.theme.pause();

		// Start Power Up Song from Beginning 
		var powerUpSong = document.getElementById("cant")
		powerUpSong.currentTime = 0;
		powerUpSong.play();
    	
    	setTimeout(function(){
    		document.getElementById("streak").innerHTML = "Get Small!";
    		document.getElementById("cant").pause();

    		changeTheme();
			_CONFIG.multMessage = "Get Small!";
    		_CONFIG.wormReduction = 0.3;
    		_CONFIG.theme.play();
    		clearInterval(colorChange);
    	}, 5000);
    	
    	// Remove Player Power Up
    	_PLAYER.power = false;
    }// Space Bar Key Press
    else if(key == 27){
    	// Pause
    	if(_CONFIG.speed > 0 && _CONFIG.pause){
	    	_CONFIG.speed = 0;
	    	_CONFIG.theme.pause();
	    	clearInterval(_CONFIG.game);
	    	clearInterval(_CONFIG.timer);

	    	// Change Message
	    	document.getElementById("streak").innerHTML = "PAUSED!";
	    }
	    // Play
	    else if(_CONFIG.speed == 0){
	    	_CONFIG.speed = 70;
	    	_CONFIG.theme.play();
	    	_CONFIG.game  = setInterval(paint, _CONFIG.speed);
	    	_CONFIG.timer = setInterval(function(){
					_CONFIG.seconds++;
					document.getElementById("timeText").innerHTML = _CONFIG.seconds;
				}, 1000);

	    	// Change Message
	    	document.getElementById("streak").innerHTML = _CONFIG.multMessage;
	    }
    }
})
