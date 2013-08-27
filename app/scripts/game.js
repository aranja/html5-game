/*global define, $ */

define(['player', 'platform'], function(Player, Platform) {
  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'));
    this.platformsEl = el.find('.platforms');

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);

    this.platforms = [];
    this.createPlatforms();
  };

  Game.prototype.createPlatforms = function() {
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
  };

  Game.prototype.addPlatform = function(platform) {
    this.platforms.push(platform);
    this.platformsEl.append(platform.el);
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    this.player.onFrame(delta);

    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    // Restart the onFrame loop
    this.lastFrame = +new Date() / 1000;
    requestAnimFrame(this.onFrame);
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