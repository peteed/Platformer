var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_CLIMB = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var LEFT = 0;
var RIGHT = 1;

var left = false;
var right = false;

var STATE_WALKING = 0;
var STATE_CLIMBING = 1;
var playerState = STATE_WALKING;


function createPlayer() {
	return{	
		sprite: 0,	
		position: new Vector2(2*TILE, 15*TILE),
		velocity: new Vector2(0, 0),
		falling: true,
		jumping: false,
		direction: RIGHT,
		lives: 3,
		set: false,

		setupAnimation: function() {
			this.sprite = new Sprite("Sprites/ChuckNorris.png");
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [8, 9, 10, 11, 12]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [52, 53, 54, 55, 56, 57, 58, 59]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [60, 61, 62, 63, 64]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
			this.sprite.buildAnimation(12, 8, chuckWidth, chuckHeight, 0.05, [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);

			for (var i = 0; i < ANIM_MAX; i++) {
				this.sprite.setAnimationOffset(i, -(chuckWidth / 2), -(chuckHeight / 2) - 28);
			};
		},


		
		updateClimbState: function(deltaTime) {
			climbUp = false;
			climbDown = false;
			wasMovingUp = false;
			wasMovingDown = false;


			if (keyboard.isKeyDown(keyboard.KEY_W)) {
				climbUp = true;
				this.sprite.update(deltaTime);
			}
			if (keyboard.isKeyDown(keyboard.KEY_S)) {
				climbDown = true;
				this.sprite.update(deltaTime);
			}

			if (this.velocity.y > 0) {
				wasMovingUp = true;
			}
			if (this.velocity.y < 0) {
				wasMovingDown = true;
			}

			var accelerationY = 0;
			if (climbUp) {
				accelerationY = accelerationY - ACCELERATION;
				} else if (wasMovingUp) {
					this.velocity.y = 0;
				}
			if (climbDown) {
				accelerationY = accelerationY + ACCELERATION;
			} else if (wasMovingDown) {
				this.velocity.y = 0;
			}

			
			this.velocity.y -=accelerationY;

			var tileX = pixelToTile(this.position.x);
			var tileY = pixelToTile(this.position.y);
			var climbableCell = cellDataAtTileCoord(LAYER_WALKABLE, tileX, tileY);
			var climbableCellRight = cellDataAtTileCoord(LAYER_WALKABLE, tileX + 1, tileY);
			var climbableCellDown = cellDataAtTileCoord(LAYER_WALKABLE, tileX, tileY + 1);
			var climbableCellDiag = cellDataAtTileCoord(LAYER_WALKABLE, tileX + 1, tileY + 1);

			if (this.velocity.y > 0 || wasMovingDown) {
				if (!climbableCellDown && !climbableCell || !climbableCellDiag && !climbableCellRight) {
					playerState = STATE_WALKING;
					return;
				} else if (this.velocity.y < 0 || wasMovingUp) {
					if (!climbableCell && climbableCellDown || !climbableCellRight && climbableCellDiag) {
						playerState = STATE_WALKING;
						return;
					}
				}
			}
		},
		updateRunJumpState: function(deltaTime) {	


			if (!right && !left && !this.falling) 
			{
				var tileX = pixelToTile(this.position.x);
				var tileY = pixelToTile(this.position.y);
				var climbableCell = cellDataAtTileCoord(LAYER_CLIMBABLE, tileX, tileY);
				var climbableCellRight = cellDataAtTileCoord(LAYER_CLIMBABLE, tileX + 1, tileY);
				var climbableCellDown = cellDataAtTileCoord(LAYER_CLIMBABLE, tileX, tileY + 1);
				var climbableCellDiag = cellDataAtTileCoord(LAYER_CLIMBABLE, tileX + 1, tileY + 1);
	
			

				if (climbableCell || climbableCellRight) {
					if (keyboard.isKeyDown(keyboard.KEY_W)) {
						
						playerState = STATE_CLIMBING;
						this.sprite.setAnimation(ANIM_CLIMB);
						return;					
					}
				}

				if (climbableCellDown || climbableCellDiag) {
					if (keyboard.isKeyDown(keyboard.KEY_S)) {
						playerState = STATE_CLIMBING;
						this.sprite.setAnimation(ANIM_CLIMB);
						return;
					}
				}
			}

			var left = false;
			var right = false;
			var jump = false;
			var falling = this.falling;


			if (this.position.y > SCREEN_HEIGHT) {
				this.position.x = 2*TILE;
				this.position.y = 15*TILE;
				this.direction = RIGHT;
				this.lives -= 1;
				sfxDie.play();
			}

			

			if (this.lives <= 0) {
				gameState = STATE_LOSE;
			}

			if (this.position.x >= 6940) {
				gameState = STATE_WIN;
			}

			if (keyboard.isKeyDown(keyboard.KEY_A)) {
				left = true;
				this.direction = LEFT;
				
			} else if (keyboard.isKeyDown(keyboard.KEY_D)) {
				right = true;
				this.direction = RIGHT;

			}

			if (keyboard.isKeyDown(keyboard.KEY_SPACE)) {
				jump = true;
				
			}


			var wasLeft = this.velocity.x < 0;
			var wasRight = this.velocity.x > 0;
			var accelX = 0;
			var accelY = GRAVITY;


			if (left) {
				this.direction = LEFT;
				if (this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping) {
					this.sprite.setAnimation(ANIM_WALK_LEFT);
				}
				
			} else if (right) {
				this.direction = RIGHT;
			if (this.sprite.currentAnimation != ANIM_WALK_RIGHT && !this.jumping) {
					this.sprite.setAnimation(ANIM_WALK_RIGHT);
				}

			} else {
				if (!this.jumping && !this.falling) {
					if (this.direction == LEFT) {
						if (this.sprite.currentAnimation != ANIM_IDLE_LEFT) {
							this.sprite.setAnimation(ANIM_IDLE_LEFT);
						}
					} else if (this.direction == RIGHT) {
						if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT) {
							this.sprite.setAnimation(ANIM_IDLE_RIGHT);
						}
					}
				}
			}


			if (left) {
				accelX -= ACCELERATION;
				if (this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping) {

				}
				
			} else if (wasLeft) {
				accelX += FRICTION;
			}

			if (right) {
				accelX += ACCELERATION;
				
			} else if (wasRight) {
				accelX -= FRICTION;
			}

			if (jump && !this.jumping && !this.falling) {
				this.jumping = true;
				accelY -= JUMP_FORCE;
				sfxJump.play();
				if (this.direction == RIGHT) {
				this.sprite.setAnimation(ANIM_JUMP_RIGHT);
				} else if (this.direction == LEFT) {
					this.sprite.setAnimation(ANIM_JUMP_LEFT);
				}
			}

			this.position.x = Math.floor(this.position.x + (this.velocity.x * deltaTime));
			this.position.y = Math.floor(this.position.y + (this.velocity.y * deltaTime));

			this.velocity.x = clamp(this.velocity.x + accelX * deltaTime, -MAX_HORIZ_SPEED, MAX_HORIZ_SPEED);
			this.velocity.y = clamp(this.velocity.y + accelY * deltaTime, -MAX_VERT_SPEED, MAX_VERT_SPEED);

			if ((wasLeft && (this.velocity.x > 0)) || (wasRight && (this.velocity.x < 0))) {
				this.velocity.x = 0;
			}

			var tileX = pixelToTile(this.position.x);
			var tileY = pixelToTile(this.position.y);
			var overlapX = this.position.x % TILE;
			var overlapY = this.position.y % TILE;

			var cell = cellDataAtTileCoord(LAYER_WALKABLE, tileX, tileY);
			var cellRight = cellDataAtTileCoord(LAYER_WALKABLE, tileX + 1, tileY);
			var cellDown = cellDataAtTileCoord(LAYER_WALKABLE, tileX, tileY + 1);
			var cellDiag = cellDataAtTileCoord(LAYER_WALKABLE, tileX + 1, tileY + 1);

//-----------------------------------------------------------------------------------------------------
			
		


			if (this.velocity.y > 0) {
				if ((cellDown && !cell) || (cellDiag && !cellRight && overlapX)) {
					this.jumping = false;
					this.falling = false;
					this.velocity.y = 0;
					this.position.y = tileToPixel(tileY);
					overlapY = 0;
				}
			} else if (this.velocity.y < 0) {
				if ((cell && !cellDown) || (cellRight && !cellDiag && overlapX)) {
					this.velocity.y = 0;
					this.position.y = tileToPixel(tileY + 1);
					cell = cellDown;
					cellRight = cellDiag;
					overlapY = 0;
				}
			}

			if (this.velocity.x > 0) {
				if ((cellRight && !cell) || (cellDiag && !cellDown && overlapY)) {
					this.velocity.x = 0;
					this.position.x = tileToPixel(tileX);
				}
			} else if (this.velocity.x < 0) {
				if ((cell && !cellRight) || (cellDown && !cellDiag && overlapY)) {
					this.velocity.x = 0;
					this.position.x = tileToPixel(tileX + 1);
				}
			}			
		},

		draw: function() {			
			var screenX = chuck.position.x - worldOffsetX;
			this.sprite.draw(context, screenX, chuck.position.y);
		}
	};
}


