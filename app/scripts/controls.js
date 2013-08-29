/*global define, $ */

define([], function() {

  var KEYS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  var FULL_ANGLE = 20;

  /**
   * Controls singleton class.
   * @constructor
   */
  var Controls = function() {
    this.keys = {};
    this.inputVec = { x: 0, y: 0 };
    this.tilt = 0;

    $(window)
      .on('keydown', this.onKeyDown.bind(this))
      .on('keyup', this.onKeyUp.bind(this))
      .on('deviceorientation', this.onOrientation.bind(this));
  };

  Controls.prototype.onOrientation = function(e) {
    e = e.originalEvent;
    if (e.gamma == null) {
      return;
    }

    var degree = e.gamma;

    if (window.orientation) {
      var dir = window.orientation / 90;
      degree = e.beta * dir;
    }

    var speed = degree / FULL_ANGLE;
    this.tilt = Math.max(Math.min(speed, 1), -1);
  };


  Controls.prototype.onKeyDown = function(e) {
    if (e.keyCode in KEYS) {
      var keyName = KEYS[e.keyCode];
      this.keys[keyName] = true;
      return false;
    }
  };

  Controls.prototype.onKeyUp = function(e) {
    if (e.keyCode in KEYS) {
      var keyName = KEYS[e.keyCode];
      this.keys[keyName] = false;
    }
  };

  Controls.prototype.onFrame = function() {
    if (this.keys.right) {
      this.inputVec.x = 1;
    } else if (this.keys.left) {
      this.inputVec.x = -1;
    } else {
      this.inputVec.x = 0;
    }

    if (this.inputVec.x === 0) {
      this.inputVec.x = this.tilt;
    }
  };
  
  // Export singleton.
  return new Controls();
});
