/*global define, $ */

define(['player', 'platform', 'enemy', 'controls'], function(Player, Platform, Enemy, controls) {

  var VIEWPORT_PADDING = 100;

  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'), this);
    this.entities = [];
    this.platformsEl = el.find('.platforms');
    this.entitiesEl = el.find('.entities');
    this.worldEl = el.find('.world');
    this.isPlaying = false;

    this.sound = new Howl({
      urls: ['/sounds/main.mp3', '/sounds/main.ogg'],
      sprite: {
        blast: [0, 2000],
        laser: [3000, 700],
        winner: [5000, 9000]
      }
    });

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };

  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
  };

  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };


  Game.prototype.createWorld = function() {
    // Ground
    this.addPlatform(new Platform({
      x: 100,
      y: 418,
      width: 800,
      height: 10
    }));

    // Floating platforms
    this.addPlatform(new Platform({
      x: 300,
      y: 258,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 500,
      y: 288,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 400,
      y: 158,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 750,
      y: 188,
      width: 100,
      height: 10
    }));

    this.addEnemy(new Enemy({
      start: {x: 400, y: 350},
      end: {x: 400, y: 200}
    }));
  };

  Game.prototype.addPlatform = function(platform) {
    this.entities.push(platform);
    this.platformsEl.append(platform.el);
  };

  Game.prototype.addEnemy = function(enemy) {
    this.entities.push(enemy);
    this.entitiesEl.append(enemy.el);
  };

  Game.prototype.gameOver = function() {
    this.freezeGame();
    alert('You are game over! Sorry man...');

    var game = this;
    setTimeout(function() {
      game.start();
    }, 0);
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    if (!this.isPlaying) {
      return;
    }

    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    controls.onFrame(delta);
    this.player.onFrame(delta);

    for (var i = 0, e; e = this.entities[i]; i++) {
      e.onFrame(delta);

      if (e.dead) {
        this.entities.splice(i--, 1);
      }
    }

    this.updateViewport();

    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.updateViewport = function() {
    var minX = this.viewport.x + VIEWPORT_PADDING;
    var maxX = this.viewport.x + this.viewport.width - VIEWPORT_PADDING;

    var playerX = this.player.pos.x;

    // Update the viewport if needed.
    if (playerX < minX) {
      this.viewport.x = playerX - VIEWPORT_PADDING;
    } else if (playerX > maxX) {
      this.viewport.x = playerX - this.viewport.width + VIEWPORT_PADDING;
    }

    this.worldEl.css({
      left: -this.viewport.x,
      top: -this.viewport.y
    });
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    // Cleanup last game.
    this.entities.forEach(function(e) { e.el.remove(); });
    this.entities = [];

    // Set the stage.
    this.createWorld();
    this.player.reset();
    this.viewport = {x: 100, y: 0, width: 800, height: 600};

    // Then start.
    this.unFreezeGame();
  };

  Game.prototype.forEachPlatform = function(handler) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Platform) {
        handler(e);
      }
    }
  };

  Game.prototype.forEachEnemy = function(handler) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Enemy) {
        handler(e);
      }
    }
  };

  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  return Game;
});