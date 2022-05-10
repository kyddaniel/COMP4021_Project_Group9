// This function defines the Pea module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the pea
// - `y` - The initial y position of the pea
const Pea = function(ctx, x, y , gameArea, atRow) {

    // This is the sprite sequence of the pea
    const sequence = {
        normal:   {x: 0, y: 0, width: 10, height: 14, count: 1, timing: 500, loop: true},
        cheat:   {x: 0, y: 0, width: 146, height: 194, count: 1, timing: 500, loop: true}
    };

    // This is the sprite object of the pea created from the Sprite module.
    const sprite = Sprite(ctx, x, y);


    if(atRow==0 || atRow==1) {
        side = 1;
    }
    else {
        side = 2;
    }
    
    const peaSpeed = 3;

    let peaDamage = 1;


    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequence.normal)
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

    const getSide = function() {
        return side;
    }

    const getDamage = function(){
        return peaDamage;
    }

    const useCheat = function(){
        peaDamage = 50;
        sprite.setSequence(sequence.cheat)
              .setScale(0.4)
              .setShadowScale({ x: 0, y: 0 })
              .useSheet("sprite/gibson_sprite.png");
    }

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,
        
        getSide,
        getDamage,
        useCheat,
        peaUpdate,
        getBoundingBox: sprite.getBoundingBox
    };
};
