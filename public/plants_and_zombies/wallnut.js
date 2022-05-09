// This function defines the Wallnut module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the wallnut
// - `y` - The initial y position of the wallnut
const Wallnut = function(ctx, x, y, state) {

    // This is the sprite sequence of the fire
    const sequences = {
        healthy:     {x: 0, y: 1,  width: 27, height: 30, count: 5, timing: 200, loop: true},
        ok_healthy:  {x: 0, y: 29, width: 27, height: 29, count: 5, timing: 200, loop: true},
        not_healthy: {x: 0, y: 64, width: 27, height: 29, count: 5, timing: 200, loop: true}
    };

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    /* can change!!!!! */
    let health = 20;

    let halfHealth = false;
    let noHealth = false;

    const plantUpdate = function(time) {
        
        if (!halfHealth && health <= 10) {
            sprite.setSequence(sequences.not_healthy);
            halfHealth = true;
        }

        if(!noHealth && health <= 0) {
            sprite.setSequence(sequences.not_healthy);
            noHealth = true;
        }

        /* Update the sprite object */
        sprite.update(time);
    };

    const takeDamage = function(damage) {
        health -= damage;

        if(health <= 0) {
            return true;
        }
        else {
            if(!halfHealth && health <= 10) {
                sprite.setSequence(sequences.not_healthy);
                halfHealth = true;
            }
            return false;
        }
    }

    const getPlantType = function() {
        return 4;
    }

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequences.healthy)
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/wallnut_sprite_cut.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,

        plantUpdate,
        takeDamage,
        getPlantType
    };
};
