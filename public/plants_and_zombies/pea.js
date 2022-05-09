// This function defines the Pea module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the pea
// - `y` - The initial y position of the pea
const Pea = function(ctx, x, y , gameArea) {

    // This is the sprite sequence of the pea
    const sequence = {x: 0, y: 0, width: 10, height: 14, count: 1, timing: 500, loop: true};

    // This is the sprite object of the pea created from the Sprite module.
    const sprite = Sprite(ctx, x, y);


    //const peaSpeed = 3;
    const peaSpeed = 3;



    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequence)
          .setScale(2)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet("sprite/pea_sprite.png");



    // This function updates the peas position
    // - `time` - The timestamp when this function is called
    const peaUpdate = function(time) {
        
        let state = false;


        let { x, y } = sprite.getXY();

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y)) {
            sprite.setXY(x + peaSpeed, y);
        }
        else {
            sprite.setXY(1000, 1000);
            state = true;
        }         

        /* Update the sprite object */
        sprite.update(time);

        return state;
    };


    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,
        
        peaUpdate,
        getBoundingBox: sprite.getBoundingBox
    };
};
