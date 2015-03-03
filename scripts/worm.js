// Canvas Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// Worm Body
var _WORM = []; 
var _FOOD = [];

// Walls
var _WALLS = [];

// Theme Colors ordered by Worm Color, Food Color, Background Color, and Name
var _THEMES	=  [["Basic", "#ecf0f1", "#2ecc71", "#000000", "#3498db"], 
				["Bone", "#cbcad0", "#81c142", "#0f7d0d", "#7f8c8d"], 
				["Gears", "#e91a0a", "#ffffff", "#000000", "#333333"], 
				["Halo", "#505e82", "#a2b7dc", "#13263e", "#34495e"], 
				["Hotline", "#FFFFFF", "#DB0A5B", "#1abc9c", "#fbc5a3"], 
				["Inverse", "#e74c3c", "#2980b9", "#FFFFFF", "#333333"], 
				["Jibbles", "#FFFFFF", "#1abc9c", "#8e44ad", "#333333"], 
				["Legend", "#e91a0a", "#331f82", "#816830", "#333333"], 
				["Retro", "#000000", "#999999", "#FFFFFF", "#333333"],
				["Station", "#ffffff", "#0072bb", "#222b6c", "#333333"], 
				["Sunset", "#e67e22", "#27ae60", "#2980b9", "#333333"], 
				["Sunrise", "#d35400", "#f1c40f", "#f39c12", "#666666"]];

// Config Object
var _CONFIG = {
	wormWidth: 25,
	wormLength: 5,
	wormReduction: 0.4,
	wormGrowth: 0,
	wormGrowthLimit: 5,
	wormColor: _THEMES[0][1],
	foodAmount: 3,
	foodColor: _THEMES[0][2],
	bgColor: _THEMES[0][3],
	wallColor: _THEMES[0][4],
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
	version: "1.7.1"
}

// Player Object
var _PLAYER = {
	score: 0,
	highScore: 0,
	power: false,
	mult: 1,
	streakCount: 0,
	direction: "down",
	difficulty: "medium",
	difficultyBonus: 5
}

// Create Worm Fact Array
var _FACT = ["A worm has no arms, but has elbows.", 
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
			"Worms can be expensive... but they are not cheap either considering..."];

// Display Version Number
document.getElementById("version").innerHTML = _CONFIG.version;

// Create Achievment Obj Array
var _ACHIEVEMENTS = [{
						Name: "Modern Dieter",
						Desc: "Last a minute without eating any food.",
						Src: "",
						Progress: 0,
						Total: 60
					},{
						Name: "Super Buffet",
						Desc: "Ate one hundred food pellets and became a Super Worm.",
						Src: "",
						Progress: 0,
						Total: 1
					},{
						Name: "That\'s what she said",
						Desc: "Last five minutes while playing hard.",
						Src: "",
						Progress: 0,
						Total: 300
					},{
						Name: "Welcome to the 1%",
						Desc: "Reach one million points.",
						Src: "",
						Progress: 0,
						Total: 1000000
					},{
						Name: "Rainbow Guy",
						Desc: "Played with five different themes.",
						Src: "",
						Progress: 0,
						Total: 5
					},{
						Name: "New Fish",
						Desc: "Died in the easiest mode.",
						Src: "",
						Progress: 0,
						Total: 1
					},{
						Name: "Misophonia",
						Desc: "Muted the game music.",
						Src: "",
						Progress: 0,
						Total: 1
					},{
						Name: "...",
						Desc: "Paused the game and took a breather.",
						Src: "",
						Progress: 0,
						Total: 1
					},{
						Name: "You just can\'t stop!",
						Desc: "Used a Super Worm Power Up.",
						Src: "",
						Progress: 0,
						Total: 1
					},{
						Name: "Living on the Edge",
						Desc: "Grind the outter walls.",
						Src: "",
						Progress: 0,
						Total: 108
					},{
						Name: "Master Race",
						Desc: "Used WASD to move around instead of the arrow keys.",
						Src: "",
						Progress: 0,
						Total: 1
					}];

// Game start
function init(){

    // Create Worm and Food
    createWorm();
	createFood(-1);

	// Render Walls based off difficulty
	if(_PLAYER.difficulty == "medium")
		createMediumWalls();
	if(_PLAYER.difficulty == "hard")
		createHardWalls();

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
	_WORM  = [];
	_FOOD  = [];
	_WALLS = [];

	// Display Menu
	displayStartMenu();
	
}

// Display Start Menu
function displayStartMenu(){

	// Render Background and initialize Streak, Multiplier, Worm Color and Worm Facts Worm Fact
    calcMult(0)
    changeTheme();
    loadThemes();
    loadAchievements();
    printWormFact();
	paintBackground();
    streak(_CONFIG.streakIncrement);
    
	// Open Start Menu
	$('#StartMenu').modal({backdrop: 'static'});
}


// Pauses the Game and Displays the Start Screen
function pauseGame(){

	// Open Start Menu
	$('#StartMenu').modal({backdrop: 'static'});

	// Print a new Worm Fact
    printWormFact();

	// Change Game Flags
	document.getElementById("resumeGame").disabled = false;
	document.getElementById("startGame").disabled = true;

	// Modifiy Config Settings
	_CONFIG.speed = 0;
	_CONFIG.theme.pause();
	_CONFIG.pause = true;

	// Stop Loops
	clearInterval(_CONFIG.game);
	clearInterval(_CONFIG.timer);

	// Change Message
	document.getElementById("mainGameTitle").innerHTML = "PAUSED!";
}

// Resumes the game and Hides the Start Screen
function resumeGame(){

	// Hide Start Menu
	$('#StartMenu').modal('hide');

	// Change Game Flags
	document.getElementById("resumeGame").disabled = true;
	document.getElementById("startGame").disabled = false;

	// Modify Config settings
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

	_PLAYER.score = 0;
	_PLAYER.power = false;
	_PLAYER.mult = 1;
	_PLAYER.streakCount = 0;
	_PLAYER.direction = "down"

}

// Resets Modifiable Config Settings
function resetConfig(){

	_CONFIG.wormReduction = 0.4;
	_CONFIG.multMessage = "Get Small!";
	_CONFIG.wormGrowth = 0;
	_CONFIG.wormLength = 5;
	_CONFIG.seconds = 0;
	_CONFIG.speed = 70;
	_CONFIG.pause = false;

}

// Loads the Dropdown with the Available Themes
function loadThemes(){

	// Get Color Dropdown
	var colorDropdown = document.getElementById("wormColor");

	// Remove any existing Options
	var dropdownSize = colorDropdown.options.length;
	for(var i = 0; i < dropdownSize; ++i)
		colorDropdown.remove(0);

	// Add Default Option
	var themeOption = document.createElement("option");
	themeOption.innerHTML = "-- Select Theme --";
	colorDropdown.appendChild(themeOption);

	// Add Themes from Array
	for(var j = 0; j < _THEMES.length; ++j){
		themeOption = document.createElement("option");
		themeOption.innerHTML = _THEMES[j][0];
		colorDropdown.appendChild(themeOption);
	}
}

function loadAchievements(){
	var table = document.getElementById("achievementTable");
	// Clear table
	for(var j = 0; j < table.rows.length; ++j)
		table.deleteRow(j);

	for(var i = 0; i < _ACHIEVEMENTS.length; ++i){
		var newRow = table.insertRow(i);
		var name = newRow.insertCell(0);
		var desc = newRow.insertCell(1);

		var progressPercent = Math.round((_ACHIEVEMENTS[i].Progress/_ACHIEVEMENTS[i].Total)*100);
		var progressDiv = "<div class=\"progress\"><div id=\"achievement"+i+"\" class=\"progress-bar progress-bar-info progress-bar-striped active\" style=\"width: "+progressPercent+"%\"></div></div>"

		name.innerHTML = _ACHIEVEMENTS[i].Name;
		if(_ACHIEVEMENTS[i].Progress >= _ACHIEVEMENTS[i].Total)
			desc.innerHTML = _ACHIEVEMENTS[i].Desc;
		else
			desc.innerHTML = "Unlock secret achievement to gain a new theme!"+progressDiv;
	}
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

// Creates the Worm Body
function createWorm(){
	for (var i = _CONFIG.wormLength -1; i >= 0; i--)
		_WORM.push({
			x: Math.round((w/2)/_CONFIG.wormWidth),
			y: i
		});
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

		// Check that Food isn't on top of anything
		if(checkCollision(foodX_pos, foodY_pos, _WORM) || checkCollision(foodX_pos, foodY_pos, _WALLS))
			invalidLocation = true;
	}

	// Set Foods X and Y Coordinates
	_FOOD[index] = {
		x: foodX_pos,
		y: foodY_pos
	};

}

// Check to see that the worm is in a valid location
function checkForValidLocation(x_pos, y_pos){
	if(x_pos == -1 || x_pos == w / _CONFIG.wormWidth ||
		 y_pos == -1 || y_pos == h / _CONFIG.wormWidth || 
		 checkCollision(x_pos, y_pos, _WORM) || 
		 checkCollision(x_pos, y_pos, _WALLS))
		return false;

	return true;
}

// Paints each part of the game
function paint(){

	// Paint Canvas
	paintBackground();

	// Finds the head of the worm
	var head_xPos = _WORM[0].x;
	var head_yPos = _WORM[0].y;

	// Direction the Worm is moving
	switch(_PLAYER.direction){
		case "right":
			head_xPos++;
			break;
		case "left":
			head_xPos--;
			break;
		case "up":
			head_yPos--;
			break;
		case "down":
			head_yPos++;
			break;
	}

	// Check for failure
	if(!checkForValidLocation(head_xPos, head_yPos)){
		printScores();
		gameOver();
		return;
	}

	// Grow worm or reduce it based off if it eats food
	updateWorm(head_xPos, head_yPos);

	//Paints the worm, food and wall cells
	paintCell(_WORM,  _CONFIG.wormColor);
	paintCell(_FOOD,  _CONFIG.foodColor);
	paintCell(_WALLS, _CONFIG.wallColor);

	// Update Scores on Screen
	printScores();

}

// Update the worm size based off if it is eating food or not
function updateWorm(x_pos, y_pos){

	// Get the Head Position
	var head = {
			x: x_pos,
			y: y_pos	
		};

	// Check to see if Worm ate Food then update worm and food
	for(i = 0; i < _FOOD.length; ++i)
		if (x_pos == _FOOD[i].x && y_pos == _FOOD[i].y) {

           var totalWormKilled = _WORM.length*_CONFIG.wormReduction;

           for(var j = 0; j < (_WORM.length*_CONFIG.wormReduction); ++j)
           		head = _WORM.pop(); 

            head.x = x_pos;
            head.y = y_pos;

            _PLAYER.score += Math.round((totalWormKilled*_PLAYER.mult)*_PLAYER.difficultyBonus);
            calcMult(_CONFIG.multIncrement);
            createFood(i);
            streak(_CONFIG.streakIncrement);
		}else
			if(_CONFIG.wormGrowth > _CONFIG.wormGrowthLimit){
				head = _WORM.pop();
				head.x = x_pos;
				head.y = y_pos;
				_CONFIG.wormGrowth = 0;
			}
			else{
				head.x = x_pos;
				head.y = y_pos;
				_CONFIG.wormGrowth++;
			}

	// Redistribute Worm Array
	_WORM.unshift(head);
}

// Creates Walls made for Medium Difficulty
function createMediumWalls(){

	var starting_XPoint = Math.floor((w/_CONFIG.wormWidth)/2)-6;
	var reflection_XPoint = Math.floor((w/_CONFIG.wormWidth)/2) + 5;

	var starting_YPoint = Math.floor((h/_CONFIG.wormWidth)/2)-1;
	var reflection_YPoint = Math.floor((h/_CONFIG.wormWidth)/2)-1;

	var maxWallPerSection = 6;

	/*
			Medium Walls:
			   =	=
		       =	=
		   -----	-----
			   =	=
			   =	=
	*/
	for(var j = 0; j < maxWallPerSection; ++j){
		// Get West walls
		_WALLS[j + (maxWallPerSection*0)] = {
			x: starting_XPoint - j,
			y: starting_YPoint
		};
		_WALLS[j + (maxWallPerSection*1)] = {
			x: reflection_XPoint + j,
			y: reflection_YPoint
		};

		// Get North Walls
		_WALLS[j + (maxWallPerSection*2)] = {
			x: starting_XPoint,
			y: starting_YPoint - j
		};
		_WALLS[j + (maxWallPerSection*3)] = {
			x: reflection_XPoint,
			y: reflection_YPoint - j
		};

		// Get South Walls
		_WALLS[j + (maxWallPerSection*4)] = {
			x: starting_XPoint,
			y: starting_YPoint + j
		};
		_WALLS[j + (maxWallPerSection*5)] = {
			x: reflection_XPoint,
			y: reflection_YPoint + j
		};
	}
	
	// Paint Walls
	paintCell(_WALLS, _CONFIG.wallColor);
}

// Creates Walls made for Hard Difficulty
function createHardWalls(){

	var starting_XPoint = Math.floor((w/_CONFIG.wormWidth)/3)+1;
	var reflection_XPoint = Math.floor((w/_CONFIG.wormWidth)/3)*2-2;

	var starting_YPoint = Math.floor((h/_CONFIG.wormWidth)/3)+1;
	var reflection_YPoint = Math.floor((h/_CONFIG.wormWidth)/3)+1;

	var maxWallPerSection = 5;

	/*
		   Hard Walls:
			=		=
			=		=
		-----		-----

		-----		-----
			=		=
			=		=

	*/
	for(var j = 0; j < maxWallPerSection; ++j){
		// Get NorthWest Wall
		_WALLS[j + (maxWallPerSection*0)] = {
			x: starting_XPoint - j,
			y: starting_YPoint
		};
		_WALLS[j + (maxWallPerSection*1)] = {
			x: starting_XPoint,
			y: starting_YPoint - j
		};

		// Get NorthEast Wall
		_WALLS[j + (maxWallPerSection*2)] = {
			x: reflection_XPoint + j,
			y: reflection_YPoint
		};
		_WALLS[j + (maxWallPerSection*3)] = {
			x: reflection_XPoint,
			y: reflection_YPoint - j
		};

		// SouthWest Wall
		_WALLS[j + (maxWallPerSection*4)] = {
			x: starting_XPoint - j,
			y: (starting_YPoint*2-2)
		};
		_WALLS[j + (maxWallPerSection*5)] = {
			x: starting_XPoint,
			y: (starting_YPoint*2-2) + j
		};

		// SouthEast Wall
		_WALLS[j + (maxWallPerSection*6)] = {
			x: reflection_XPoint + j,
			y: (reflection_YPoint*2-2)
		};
		_WALLS[j + (maxWallPerSection*7)] = {
			x: reflection_XPoint,
			y: (reflection_YPoint*2-2) + j
		};

	}

	// Paint Walls
	paintCell(_WALLS, _CONFIG.wallColor);
}

// Paints the Background of the Canvas
function paintBackground(){
	ctx.fillStyle = _CONFIG.bgColor;
	ctx.fillRect(0, 0, w, h);
	ctx.stokeStyle = "white";
	ctx.strokeRect(0, 0, w, h);
}

//paints the cells of the worm and food
function paintCell(gameArray, color){
	// Paint the cell
	for(var i = 0; i < gameArray.length; ++i){
		ctx.fillStyle = color;
		ctx.fillRect(gameArray[i].x * _CONFIG.wormWidth, gameArray[i].y * _CONFIG.wormWidth, _CONFIG.wormWidth, _CONFIG.wormWidth);
		ctx.strokeStyle = "black";
		ctx.strokeRect(gameArray[i].x * _CONFIG.wormWidth, gameArray[i].y * _CONFIG.wormWidth, _CONFIG.wormWidth, _CONFIG.wormWidth);
	}
}

//Check to see if the worm has touched a wall or itself
function checkCollision(x, y, array){
	for (var i = 0; i < array.length; i++)
    	if (array[i].x == x && array[i].y == y) return true;

	return false;
}

//Calculates the multiplier earned by the player
function calcMult(scoreAddition){
	_PLAYER.mult+=scoreAddition;
	if(_PLAYER.mult > 1)
		_PLAYER.mult -= (_PLAYER.mult%scoreAddition);

	document.getElementById("multText").innerHTML ="x"+_PLAYER.mult;
}

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

}

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
}

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
}

// Prints a new Worm Fact
function printWormFact(){
	var num = Math.floor((Math.random()*(_FACT.length-1))+1);
	document.getElementById("wFact").innerHTML = _FACT[num];
}

// Change the Game Theme
function changeTheme(){
		var colorIndex = document.getElementById("wormColor").selectedIndex-1;
		if(colorIndex >= 0){
			_CONFIG.wormColor = _THEMES[colorIndex][1];
			_CONFIG.foodColor = _THEMES[colorIndex][2];
			_CONFIG.bgColor   = _THEMES[colorIndex][3];
			_CONFIG.wallColor = _THEMES[colorIndex][4];
		}
		else {
			_CONFIG.wormColor = _THEMES[0][1];
			_CONFIG.foodColor = _THEMES[0][2];
			_CONFIG.bgColor   = _THEMES[0][3];
			_CONFIG.wallColor = _THEMES[0][4];
		}
}

// Removes focus from dropdown focus remains on game
function onWormColorChange(){
	changeTheme();
	document.getElementById("wormColor").blur();
}

// Mute or unmute the Game volume
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

// Modify the Game Settings based of the difficulty
function onDifficultyClick(e){

	// Change Styles
	UpdateDifficultyButtonStyles(e);

	// Change Game Settings
	switch(e.target.id){
		case "easy":
			changeDifficultySettings(5, 85, "easy", 1);
			break;
		case "medium":
			changeDifficultySettings(3, 70, "medium", 5);
			break;
		case "hard":
			changeDifficultySettings(2, 60, "hard", 10);
			break;
		default:
			changeDifficultySettings(3, 70, "medium", 5);
			break;
	}
}

// Changes the difficulty settings of the game
function changeDifficultySettings(food, speed, difficulty, bonus){
	_CONFIG.foodAmount = food;
	_CONFIG.speed = speed;
	_PLAYER.difficulty = difficulty;
	_PLAYER.difficultyBonus = bonus;
}

// Update the difficulty button styles 
function UpdateDifficultyButtonStyles(e){

	// Clear Styles
	document.getElementById("easy").removeAttribute("style");
	document.getElementById("medium").removeAttribute("style");
	document.getElementById("hard").removeAttribute("style");

	// Remove opacity, add width and give game font for button clicked
	document.getElementById(e.target.id).removeAttribute("style");
	document.getElementById(e.target.id).style.fontFamily = "Bangers";
	document.getElementById(e.target.id).style.width = "170px";
}

// Gives the player a power up to reduce worm size more with each food pellet
function powerUp(){

	// Alternate Colors
	var currentColor = _CONFIG.foodColor;
	var colorChange = setInterval(function(){
				    		if(_CONFIG.foodColor == currentColor)
				    			_CONFIG.foodColor = "red";
				    		else _CONFIG.foodColor = currentColor;}
				    	, 100);
	_CONFIG.foodColor = currentColor;
	_CONFIG.wormReduction = 3;
	_CONFIG.theme.pause();

	// Start Power Up Song from Beginning 
	if(!_CONFIG.mute){
		var powerUpSong = document.getElementById("cant")
		powerUpSong.currentTime = 0;
		powerUpSong.play();
	}
	
	// Return to normal after 5 seconds
	setTimeout(function(){
		document.getElementById("streak").innerHTML = "Get Small!";
		if(!_CONFIG.mute){
			document.getElementById("cant").pause();
		}

		changeTheme();
		_CONFIG.multMessage = "Get Small!";
		_CONFIG.wormReduction = 0.4;
		_CONFIG.theme.play();
		clearInterval(colorChange);
	}, 5000);
	
	// Remove Player Power Up
	_PLAYER.power = false;
}

// Keyboard controls
$(document).keydown(function(e) {
    var key = e.which;
    
    // Left
    if ((key == 37 || key == 65) && _PLAYER.direction != "right" && !$('#StartMenu').hasClass('in')) 
    	_PLAYER.direction = "left";
    // Up
    else if ((key == 38 || key == 87) && _PLAYER.direction != "down" && !$('#StartMenu').hasClass('in')) 
    	_PLAYER.direction = "up";
    // Right
    else if ((key == 39 || key == 68) && _PLAYER.direction != "left" && !$('#StartMenu').hasClass('in')) 
    	_PLAYER.direction = "right";
    // Down
    else if ((key == 40 || key == 83) && _PLAYER.direction != "up" && !$('#StartMenu').hasClass('in')) 
    	_PLAYER.direction = "down";
    // Space
    else if(key == 32 && _PLAYER.power)
    	powerUp();
    // ESC
    else if(key == 27){
    	// Pause
    	if(_CONFIG.speed > 0 && !_CONFIG.pause)
    		pauseGame();
	    // Play
	    else if(_CONFIG.pause)
	    	resumeGame();
	    
    }
    // Enter
    else if(key == 13){
    	if($('#StartMenu').hasClass('in')){
			$('#StartMenu').modal('hide');
    		if(_CONFIG.pause)
    			resumeGame();
    		else
    			init();
    	}
    }
})