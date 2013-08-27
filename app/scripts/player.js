/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 400;
  var JUMP_VELOCITY = 1500;
  var GRAVITY = 4000;
  var PLAYER_HALF_WIDTH = 14;
  var PLAYER_RADIUS = 30;

  var HELL_Y = 500;

  var Player = function(el, game) {
    this.game = game;
    this.el = el;
  };

  Player.prototype.reset = function() {
    this.pos = { x: 200, y: 400 };
    this.vel = { x: 0, y: 0 };
  }

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
    if (controls.keys.space && this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;

    // Collision detection
    this.checkPlatforms(oldY);
    this.checkEnemies();
    this.checkGameOver();

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

    this.el.toggleClass('jumping', this.vel.y < 0);
    this.el.toggleClass('walking', this.vel.x !== 0);
  };

  Player.prototype.checkGameOver = function() {
    if (this.pos.y > HELL_Y) {
      this.game.gameOver();
    }
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      if (p.rect.y >= oldY && p.rect.y < that.pos.y) {

        // Are inside X bounds.
        if (that.pos.x + PLAYER_HALF_WIDTH >= p.rect.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rect.right) {
          // COLLISION. Let's stop gravity.
          that.pos.y = p.rect.y;
          that.vel.y = 0;
        }
      }
    });
  };

  Player.prototype.checkEnemies = function() {
    var centerX = this.pos.x;
    var centerY = this.pos.y - 40;
    var that = this;
    this.game.forEachEnemy(function(enemy) {
      // Distance squared
      var distanceX = enemy.pos.x - centerX;
      var distanceY = enemy.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (enemy.radius + PLAYER_RADIUS) * (enemy.radius + PLAYER_RADIUS);

      // What up?
      if (distanceSq < minDistanceSq) {
        that.game.gameOver();
      }
    });
  };

  return Player;
});
