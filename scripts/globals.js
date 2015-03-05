// Game Canvas Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// Game Editor Canvas Variables
var editorCanvas  = document.getElementById("gameEditor");
var editorContext = editorCanvas.getContext("2d");

// Worm Body
var _WORM = []; 
var _FOOD = [];

// Walls
var _WALLS = [];

// Theme Colors ordered by Name, Worm Color, Food Color, Background Color, and Wall Color
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

// Theme Colors that are unlocked via achievements
var _SECRET_THEMES	=  [["Candy", "#FFFFFF", "#d31837", "#d22285", "#e44ea5"], 
						["Saiyajin", "#5977b7", "#fdc323", "#f8ebdb", "#ffa614"], 
						["Fat Cat", "#f59e36", "#fdd1b0", "#FFFFFF", "#fbef9a"], 
						["Money", "#5aaf23", "#3e711d", "#FFFFFF", "#e3c91c"], 
						["Rainbow", "#ff2727", "#30fc32", "#fffd00", "#9720fb"],
						["World 1-1", "#66df2c", "#ff9c3e", "#6b88fe", "#db5d2a"],
						["Muted", "#697e8d", "#e9e6c2", "#d6d5bd", "#c3a770"],
						["CitCat", "#FFFFFF", "#fbc9b5", "#ec2227", "#a71e22"],
						["Gotta Go Fast", "#efe4b0", "#FFFFFF", "#3f48cc", "#ed1c24"],
						["Grinder", "#000000", "#fbe0b3", "#ffb901", "#646464"],
						["600FPS/10800P", "#ffffff", "#e59f00", "#ffd305", "#000000"],
						["Everything is Awesome", "#ffffff", "#ffff00", "#ff0000", "#000000"]];

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
	version: "1.8.0"
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
						Total: 100
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
						Desc: "Paused the game and took a break.",
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
						Total: 4
					},{
						Name: "Builder",
						Desc: "Created a custom level.",
						Src: "",
						Progress: 0,
						Total: 1
					}];

// Game Editor
var _EDITOR = {
				walls: [],
				size: 30,
				cellSize: 12.5,
				gridColor: "#DDD",
				cellColor: "#06C",
				saved: false
			};