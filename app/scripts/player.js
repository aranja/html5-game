/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 200;
  var JUMP_VELOCITY = 1500;
  var GRAVITY = 4000;

  var Player = function(el) {
    this.el = el;
    this.jumping = false;
    this.pos = { x: 200, y: 400 };
    this.vel = { x: 0, y: 0 };
  };

  Player.prototype.onFrame = function(delta) {
    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }

    // Jumping
    if (controls.keys.space && !this.jumping) {
      this.vel.y = -JUMP_VELOCITY;
      this.jumping = true;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;

    // Collision with ground
    if (this.pos.y > 400) {
      this.pos.y = 400;
      this.vel.y = 0;
      this.jumping = false;
    }

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
  };

  return Player;
});
