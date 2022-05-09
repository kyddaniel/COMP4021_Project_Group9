// This function defines the Wallnut module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the wallnut
// - `y` - The initial y position of the wallnut
const Conezombie = function(ctx, x, y, state) {

    // This is the sprite sequence of the fire
    const sequences = {
        walking: {x: 3,   y: 0, width: 27, height: 57, count: 11, timing: 200, loop: true},
        eating:  {x: 305, y: 0, width: 27, height: 50, count: 8 , timing: 200, loop: true},
    };

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequences[state])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/cone_zombie_sprite.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update
    };
};
