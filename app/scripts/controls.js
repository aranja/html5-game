/*global define, $ */

define([], function() {
  /**
   * Controls singleton class.
   * @constructor
   */
  var Controls = function() {
    this.spacePressed = false;
    $(window)
      .on('keydown', this.onKeyDown.bind(this))
      .on('keyup', this.onKeyUp.bind(this));
  };

  Controls.prototype.onKeyDown = function(e) {
    if (e.keyCode === 32) {
      this.spacePressed = true;
    }
  };

  Controls.prototype.onKeyUp = function(e) {
    if (e.keyCode === 32) {
      this.spacePressed = false;
    }
  };
  
  // Export singleton.
  return new Controls();
});
