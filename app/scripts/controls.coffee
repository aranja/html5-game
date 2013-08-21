define [], ->
  class Controls
    spacePressed: false

    constructor: ->
      $(window)
        .on('keydown', @onKeyDown.bind(@))
        .on('keyup', @onKeyUp.bind(@))
    onKeyDown: (e) ->
      @spacePressed = true if e.keyCode == 32
    onKeyUp: (e) ->
      @spacePressed = false if e.keyCode == 32

  return new Controls
