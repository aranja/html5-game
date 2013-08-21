define ['controls'], (controls) ->
  class Player
    speed: 100

    constructor: (el) ->
      @el = el
      @pos =
        x: 0
        y: 0

    onFrame: (delta) ->
      if controls.spacePressed
        @pos.x += delta * @speed

      if @pos.x > 200 or @pos.x < 0
        @speed *= -1

      # Update UI
      @el.css '-webkit-transform', "translate(#{@pos.x}px,#{@pos.y}px)"

  return Player;