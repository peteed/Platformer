var KEY_SPACE = 32;
var KEY_UP = 87;
var KEY_DOWN = 40;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_ENTER = 13;
var SPACE_HELD = false;
var startFrameMilliseconds = performance.now();
var endFrameMilliseconds = performance.now();

function getDeltaTime()
{
	endFrameMilliseconds = startFrameMilliseconds;
	startFrameMilliseconds = performance.now();
	
	var deltaTime = (startFrameMilliseconds - endFrameMilliseconds) * 0.001;
	
	if(deltaTime > 1)
	{
		deltaTime = 1;
	}
	
	return deltaTime;
}







function initialize(layerIdx) {	
	cells[layerIdx] = [];	
	var idx = 0;	
	for (var y = 0; y < level1.layers[layerIdx].height; y++) {	
		cells[layerIdx][y] = [];	
		for (var x = 0; x < level1.layers[layerIdx].width; x++) {	
			if (level1.layers[layerIdx].data[idx] != 0) {
				cells[layerIdx][y][x] = 1;	
				cells[layerIdx][y - 1][x] = 1;
				cells[layerIdx][y - 1][x + 1] = 1;
				cells[layerIdx][y][x + 1] = 1;
			}	
			else if (cells[layerIdx][y][x] != 1) {
				cells[layerIdx][y][x] = 0;
			}
			idx++;
		}
	}	
}


function clamp(value, min, max) {
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}


function tileToPixel(tile) {
	return tile * TILE;
}

function pixelToTile(pixel) {
	return Math.floor(pixel/TILE);
}

function cellDataAtTileCoord(layers, tileX, tileY) {
	if (tileX < 0 || tileX >= MAP.TILES_WIDE ||tileY < 0) {
		return 1;
	} else if (tileY >= MAP.TILES_HIGH) {
		return 0;
	}
	return cells[layers][tileY][tileX];
}

function cellAtPixelCoord(layer, x, y) {
	if (x < 0 || x > SCREEN_WIDTH || y < 0) {
		return 1;
	} else if (y > SCREEN_HEIGHT) {
		return 0;
	}
	return cellDataAtTileCoord(layers, pixelToTile(x), pixelToTile(y));
}

function respawn() {
	chuck.position.x = 2*TILE;
	chuck.position.y = 15*TILE;
	chuck.right = true;
	chuck.accelX = 0;
}

function initializeAudio() {
	musicBackground = new Howl ({
		//urls: ["Audio/background.ogg"],
		urls: ["Audio/Platformer2.mp3"],
		loop: true,
		buffer: true,
		volume: 0.8,
	});
	musicBackground.play();

	sfxFire = new Howl ({
		urls: ["Audio/fireEffect"],
		buffer: true,
		volume: 0.9,
	});

	sfxJump = new Howl ({
		urls: ["Audio/jump.wav"],
		buffer:true,
		volume: 0.3,
	});

	sfxDie = new Howl ({
		urls: ["Audio/died.wav"],
		buffer: true,
		volume: 0.5,
	});

	sfxBoo = new Howl ({
		urls: ["Audio/boo.mp3"],
		buffer: true,
		volume: 1.0,
	});

	sfxWin = new Howl ({
		urls: ["Audio/win.mp3"],
		buffer: true,
		volume: 1.0,
	});
}

