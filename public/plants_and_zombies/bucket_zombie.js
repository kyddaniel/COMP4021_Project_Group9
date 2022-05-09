// This function defines the Wallnut module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the wallnut
// - `y` - The initial y position of the wallnut
const Bucketzombie = function(ctx, x, y, state) {

    // This is the sprite sequence of the fire
    const sequences = {
        healthy:     {x: 0, y: 0,  width: 27, height: 31, count: 5, timing: 200, loop: true},
        ok_healthy:  {x: 0, y: 31, width: 27, height: 31, count: 5, timing: 200, loop: true},
        not_healthy: {x: 0, y: 62, width: 27, height: 31, count: 5, timing: 200, loop: true},
    };

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequences[state])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/wallnut_sprite_cut.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update
    };
};
