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
				["#FFFFFF", "#1abc9c", "#8e44ad"], // Jibbles
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
	pause: false,
	mute: false,
	timer: null,
	game: null,
	theme: document.getElementById("themeSong"),
	version: "1.6"
}

// Player Object
var _PLAYER = {
	score: 0,
	highScore: 0,
	power: false,
	mult: 1,
	streakCount: 0,
	direction: "down",
	difficultyBonus: 1.5,
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

// Display Version Number
document.getElementById("version").innerHTML = _CONFIG.version;

// Game start
function init(){

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

	// Clear Intervals
	clearInterval(_CONFIG.timer);
	clearInterval(_CONFIG.game);

	// Reset Globals
	resetPlayer();
	resetConfig();
	_WORM = [];
	_FOOD = [];

	// Display Menu
	displayStartMenu();
	
}

// Display Start Menu
function displayStartMenu(){

	// Render Background and initialize Streak, Multiplier, Worm Color and Worm Facts Worm Fact
    calcMult(0)
    changeTheme();
    printWormFact();
	paintBackground();
    streak(_CONFIG.streakIncrement);
    
	// Open Start Menu
	$('#StartMenu').modal({backdrop: 'static'});
}


function pauseGame(){

	// Open Start Menu
	$('#StartMenu').modal({backdrop: 'static'});

	
	document.getElementById("resumeGame").disabled = false;
	document.getElementById("startGame").disabled = true;

	_CONFIG.speed = 0;
	_CONFIG.theme.pause();
	_CONFIG.pause = true;

	clearInterval(_CONFIG.game);
	clearInterval(_CONFIG.timer);

	// Change Message
	document.getElementById("mainGameTitle").innerHTML = "PAUSED!";
}

function resumeGame(){

	$('#StartMenu').modal('hide');

	document.getElementById("resumeGame").disabled = true;
	document.getElementById("startGame").disabled = false;

	_CONFIG.pause = false;
	_CONFIG.speed = 70;
	_CONFIG.theme.play();
	_CONFIG.game  = setInterval(paint, _CONFIG.speed);
	_CONFIG.timer = setInterval(function(){
			_CONFIG.seconds++;
			document.getElementById("timeText").innerHTML = _CONFIG.seconds;
		}, 1000);

	// Change Message
	document.getElementById("mainGameTitle").innerHTML = "Super Worm";
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
	_CONFIG.multMessage = "Get Small!";
	_CONFIG.wormGrowth = 0;
	_CONFIG.wormLength = 5;
	_CONFIG.seconds = 0;
	_CONFIG.speed = 70;
	_CONFIG.pause = false;
}

// SuperWorm 1.4 - Used to reset the game with a countdown from 3
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
	paintBackground();

	// Finds the head of the worm
	var new_xPos = _WORM[0].x;
	var new_yPos = _WORM[0].y;

	// Direction the Worm is moving
	switch(_PLAYER.direction){
		case "right":
			new_xPos++;
			break;
		case "left":
			new_xPos--;
			break;
		case "up":
			new_yPos--;
			break;
		case "down":
			new_yPos++;
			break;
	}

	// Check for failure
	if(new_xPos == -1 || new_xPos == w / _CONFIG.wormWidth || new_yPos == -1 || new_yPos == h / _CONFIG.wormWidth || checkCollision(new_xPos, new_yPos, _WORM)){
		// Print Scores and End Game
		printScores();
		gameOver();
		return;
	}// if

	for(i = 0; i < _FOOD.length; ++i){
			if (new_xPos == _FOOD[i].x && new_yPos == _FOOD[i].y) {
	           var tail; 
	           var totalWormKilled = _WORM.length*_CONFIG.wormReduction;
	           for(var j = 0; j < (_WORM.length*_CONFIG.wormReduction); ++j){
	           		tail = _WORM.pop(); 
	        	}
		            tail.x = new_xPos;
		            tail.y = new_yPos;

		            _PLAYER.score += parseInt((totalWormKilled*_PLAYER.mult)*_PLAYER.difficultyBonus);//parseInt((_CONFIG.timer*((5/_WORM.length)*_WORM.length)*_PLAYER.mult)+_PLAYER.score);
		            calcMult(_CONFIG.multIncrement);
		            createFood(i);
		            streak(_CONFIG.streakIncrement);
			}else{
			var tail = {
				x: new_xPos,
				y: new_yPos
			};
			if(_CONFIG.wormGrowth > _CONFIG.wormGrowthLimit){
				tail = _WORM.pop();

				tail.x = new_xPos;
				tail.y = new_yPos;
				_CONFIG.wormGrowth = 0;
			}// if
			else{
				_CONFIG.wormGrowth++;

				tail.x = new_xPos;
				tail.y = new_yPos;
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

// Paints the Background of the Canvas
function paintBackground(){
	ctx.fillStyle = _CONFIG.bgColor;
	ctx.fillRect(0, 0, w, h);
	ctx.stokeStyle = "white";
	ctx.strokeRect(0, 0, w, h);
}

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

    // Save New High Score
    if(_PLAYER.highScore < _PLAYER.score)
    	_PLAYER.highScore = _PLAYER.score;

	// Display Game Scores
	ctx.font = 'bold 1.2em Arial';
	ctx.fillStyle = _CONFIG.foodColor;
	ctx.textAlign = "left";
	ctx.fillText("Score: "+_PLAYER.score, 5, 17);
	ctx.textAlign = "right";
	ctx.fillText("Highscore: "+_PLAYER.highScore, w-5, 17);

}// printScores()

// Sets Streak depending on the streak number
function streak(i){

	// Increment the streak
	_PLAYER.streakCount += i;

	// Display Streak Notification
	if(_PLAYER.streakCount == 100){
		streakNotification(null, "Worm Master!!!", 0.3);
		_CONFIG.wormColor = "yellow";
		clearInterval(_CONFIG.game);
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
		if(!_CONFIG.mute){
			_CONFIG.theme.volume = volume;
			document.getElementById(id).volume = 1.0;
			document.getElementById(id).play();
		}
		_PLAYER.power = true;

		// Reset Theme Volume after 6 seconds
		setTimeout(function(){
					if(!_CONFIG.mute)
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
	if(_CONFIG.mute){
		_CONFIG.mute = false;
		_CONFIG.theme.volume = 1;
		document.getElementById("volumeControl").src = "./assets/volume_on.png";
	}else{
		_CONFIG.mute = true;
		_CONFIG.theme.volume = 0;
		document.getElementById("volumeControl").src = "./assets/volume_off.png";
	}
}
	
function onDifficultyClick(e){

	document.getElementById("easy").removeAttribute("style");
	document.getElementById("medium").removeAttribute("style");
	document.getElementById("hard").removeAttribute("style");

	document.getElementById(e.target.id).style.fontFamily = "Bangers";
	document.getElementById(e.target.id).style.width = "200px";

	switch(e.target.id){
		case "easy":
			_CONFIG.foodAmount = 5;
			_CONFIG.speed = 85;
			_PLAYER.difficultyBonus = 0.5;
			break;
		case "medium":
			_CONFIG.foodAmount = 3;
			_CONFIG.speed = 70;
			_PLAYER.difficultyBonus = 1.5;
			break;
		case "hard":
			_CONFIG.foodAmount = 1;
			_CONFIG.speed = 55;
			_PLAYER.difficultyBonus = 2.5;
			break;
		default:
			_CONFIG.foodAmount = 3;
			_CONFIG.speed = 70;
			_PLAYER.difficultyBonus = 1.5;
			break;
	}
}

// Keyboard controls
$(document).keydown(function(e) {
    var key = e.which;
    
    if ((key == 37 || key == 65) && _PLAYER.direction != "right") 
    	_PLAYER.direction = "left";
    else if ((key == 38 || key == 87) && _PLAYER.direction != "down") 
    	_PLAYER.direction = "up";
    else if ((key == 39 || key == 68) && _PLAYER.direction != "left") 
    	_PLAYER.direction = "right";
    else if ((key == 40 || key == 83) && _PLAYER.direction != "up") 
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
		if(!_CONFIG.mute){
			var powerUpSong = document.getElementById("cant")
			powerUpSong.currentTime = 0;
			powerUpSong.play();
		}
    	
    	setTimeout(function(){
    		document.getElementById("streak").innerHTML = "Get Small!";
    		if(!_CONFIG.mute){
    			document.getElementById("cant").pause();
    		}

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
    	if(_CONFIG.speed > 0 && !_CONFIG.pause)
    		pauseGame();
	    // Play
	    else if(_CONFIG.speed == 0)
	    	resumeGame();
	    
    }else if(key == 13){
    	if($('#StartMenu').hasClass('in')){
			$('#StartMenu').modal('hide');
    		if(_CONFIG.pause)
    			resumeGame();
    		else
    			init();
    	}
    }
})
