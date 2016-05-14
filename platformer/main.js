var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_PAUSE = 2
var STATE_WIN = 3;
var STATE_LOSE = 4;

var gameState = STATE_SPLASH;

//Main javaScript file that is executed in the body of the HTML file
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//Canvas Constants
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

//Maths constants
var PI = 3.14159265359;

//Game Constants
var LAYER_COUNT = 4;
var LAYER_WALKABLE = 0;
var LAYER_CLIMBABLE = 1;
var LAYER_COLLECTABLES = 2;
var LAYER_VISUAL = 3;


var MAP = {TILES_WIDE:200, TILES_HIGH:20};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
//physics constants
var METER = TILE;
var GRAVITY = 9.8 * METER * 6;
//player physics properties and limits
var MAX_VERT_SPEED = METER * 19;
var MAX_HORIZ_SPEED = METER * 10;
var ACCELERATION = MAX_HORIZ_SPEED * 2;
var FRICTION = MAX_HORIZ_SPEED * 4;
var JUMP_FORCE = METER * 1500;
var CLIMB_SPEED = METER * 2;

var worldOffsetX = 0;
//var scrolledX=0;

var musicBackground;
var sfxFire;


var keyboard = new Keyboard();

var cells = [];

//Background
var background = document.createElement("img");
background.src = "Sprites/background.png";

var tileset = document.createElement("img");
tileset.src = "Sprites/tileset.png";

var splash = document.createElement("img");
splash.src = "Sprites/splash.png";

var gameOver = document.createElement("img");
gameOver.src = "Sprites/gameover.png";

var gameLose = document.createElement("img");
gameLose.src = "sprites/gamelose.png";

var heart = document.createElement("img");
heart.src = "sprites/heart.png";

//Game Objects
////Gameplay


var chuckWidth = 165;
var chuckHeight = 126;


var chuck = new createPlayer();
chuck.setupAnimation();

//setUpGame();
initialize(LAYER_WALKABLE);
initialize(LAYER_CLIMBABLE);
initializeAudio();

update();