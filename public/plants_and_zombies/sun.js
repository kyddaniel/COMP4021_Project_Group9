// This function defines the Sun module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the sun
// - `y` - The initial y position of the sun
const Sun = function(ctx, x, y) {

    // This is the sprite sequence of the fire
    const sequence = {x: 0, y: 0, width: 26, height: 26, count: 2, timing: 500, loop: true};

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequence)
          .setScale(2)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet("sprite/sun_sprite.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,

        getBoundingBox: sprite.getBoundingBox
    };
};
