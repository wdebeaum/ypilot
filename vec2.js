const defineMethods = require('./define-methods.js');

function Vec2(x,y) {
  this.x = x;
  this.y = y;
}

defineMethods(Vec2, [

function add(other) {
  return new Vec2(this.x + other.x, this.y + other.y);
},

function subtract(other) {
  return new Vec2(this.x - other.x, this.y - other.y);
},

function dot(other) {
  return this.x * other.x + this.y * other.y;
},

function scale(other) {
  if (other instanceof Vec2) {
    return new Vec2(this.x * other.x, this.y * other.y);
  } else { // Number
    return new Vec2(this.x * other, this.y * other);
  }
},

function magnitude() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
},

function normalize() {
  return this.scale(1 / this.magnitude());
},

// angle is in radians
function rotate(angle) {
  return new Vec2(this.x * Math.cos(angle) - this.y * Math.sin(angle),
                  this.x * Math.sin(angle) + this.y * Math.cos(angle));
}

]);

module.exports = Vec2;