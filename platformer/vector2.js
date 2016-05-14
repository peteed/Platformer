var Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
}

Vector2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

Vector2.prototype.zero = function() {
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.copy = function() {
	return new vector2(this.x, this.y);
}

Vector2.prototype.add = function(otherVector) {
	this.x += otherVector.x;
	this.y += otherVector.y;
}

Vector2.prototype.subtract = function(otherVector) {
	this.x -= otherVector.x;
	this.y -= otherVector.y;
}

Vector2.prototype.multiply = function(scaler) {
	this.x *= scaler.x;
	this.y *= scaler.y;
}