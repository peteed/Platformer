var splashTimer = 1;
var mouseX = -1;
var mouseY = -1;
var mousePressed = false;



	document.onmousemove = function (event) {
		mouseX = event.pageX - canvas.offsetLeft;
		mouseY = event.pageY - canvas.offsetTop;
	}
	
	document.onmousedown = function (event) {
		mousePressed = true;
	}
function runSplash() {
	
	var halfWidth = SCREEN_WIDTH / 2;
	var halfHeight = SCREEN_HEIGHT / 2;

	var buttonWidth = 200;
	var buttonHeight = 100;
	var buttonPosition = new Vector2(halfWidth - (buttonWidth / 2), halfHeight - (buttonHeight / 2));

	
	

	context.drawImage(splash, 0, 0);
	if (mouseX >= buttonPosition.x && mouseX <= buttonPosition.x + buttonWidth && mouseY >= buttonPosition.y && mouseY <= buttonPosition.y + buttonHeight) {
		context.fillStyle = "#828";
		if (mousePressed) {
			gameState = STATE_GAME;
		}
	} else {
		context.fillStyle = "#bf2";
		mousePressed = false;
	}
	context.fillRect (buttonPosition.x, buttonPosition.y, buttonWidth, buttonHeight);


	var xOffset = 25;
	var yOffset = 60;
	context.fillStyle = "#f00";
	context.font = "30px Comic Sans MS";
	context.fillText("START GAME", buttonPosition.x + xOffset, buttonPosition.y + yOffset, 150);
	
};

function runGame(deltaTime) {
	context.drawImage(background, 0 - (worldOffsetX / 10), 0);
	
	

	
	chuck.sprite.update(deltaTime);
	
	drawMap();
	if (chuck.lives >= 1) {
		context.drawImage(heart, 10, 5);
	}
	if (chuck.lives >= 2) {
		context.drawImage(heart, 10 + 36, 5);
	}
	if (chuck.lives >= 3) {
		context.drawImage(heart, 10 + 36 + 36, 5);
		}
	chuck.draw();
	
};

var sfxWinPlaying = false;
function runGameOver(deltaTime) {
	context.drawImage(gameOver, 0, 0);
	if (!sfxWinPlaying) {
		sfxWin.play();
		sfxWinPlaying = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_ENTER)) {
		gameState = STATE_GAME;
		respawn();
		chuck.lives = 3;
		sfxWinPlaying = false;
		
	}
};

var sfxBooPlaying = false;
function runGameLose(deltaTime) {
	
	context.drawImage(gameLose, 0, 0);
	if(!sfxBooPlaying){
		sfxBoo.play();
		sfxBooPlaying = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_ENTER)) {
		gameState = STATE_GAME;
		respawn();
		chuck.lives = 3;
		sfxBooPlaying = false;
		
	}
};

function update(){
	var deltaTime = getDeltaTime();
	switch (playerState) {
		case STATE_WALKING: {
			chuck.updateRunJumpState(deltaTime);
		} break;
		case STATE_CLIMBING: {
			chuck.updateClimbState(deltaTime);
		} break;
	}
	requestAnimationFrame(update);
	switch(gameState) {
		case STATE_SPLASH: {
			runSplash(deltaTime);
		} break;
		case STATE_GAME: {
			runGame(deltaTime);
		} break;
		case STATE_WIN: {
			runGameOver(deltaTime);
		} break;
		case STATE_LOSE: {
			runGameLose(deltaTime);
		} break;

	}
	
	
	
};


function drawMap() {

	var startX = -1;
	var maxTiles = (SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(chuck.position.x);
	var offsetX = TILE + (chuck.position.x - tileToPixel(tileX));

	//startX = tileX - ((SCREEN_WIDTH / TILE) / 2);
	startX = tileX - Math.floor(maxTiles / 2);


	if (startX < -1) {
		startX = -1;
		offsetX = TILE;
	}
	if (startX > MAP.tw - maxTiles) {
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}

	worldOffsetX = startX * TILE + offsetX;


	for (var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		//var idx = 0;
		for (var y = 0; y < level1.layers[layerIdx].height; y++) 
		{

			var idx = y * level1.layers[layerIdx].width + startX;

			for (var x = startX; x < startX + maxTiles; x++) 
			{
				if (level1.layers[layerIdx].data[idx] != 0) 
				{

					
					//if (chuck.position.x > (SCREEN_WIDTH / 3)*2 && chuck.direction == RIGHT){
					//	scrolledX += chuck.position.x - (SCREEN_WIDTH / 3)*2;
					//	chuck.position.x = (SCREEN_WIDTH / 3)*2;				
					//}  
						

					//if (chuck.position.x < (SCREEN_WIDTH / 3)*2 && chuck.position.x > TILE * 10 && chuck.direction == LEFT) {
					//	scrolledX -= chuck.position.x + (SCREEN_WIDTH / 3);
					//	chuck.position.x = (SCREEN_WIDTH / 3);	
					//	}
					

					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, (x - startX) * TILE - offsetX, (y - 1) * TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			};
		};
	};
};