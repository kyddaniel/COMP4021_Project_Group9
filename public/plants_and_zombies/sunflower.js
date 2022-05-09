// This function defines the Sunflower module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the sunflower
// - `y` - The initial y position of the sunflower
const Sunflower = function(ctx, x, y) {

    // This is the sprite sequence of the fire
    const sequence = {x: 0, y: 0, width: 29, height: 37, count: 8, timing: 200, loop: true};

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    /* can change!!!!! */
    let health = 5;
    let sun_produce_time = 500;


    let timer = 0;

    const plantUpdate = function(time) {
        timer++;
        sprite.update(time);
    }

    const takeDamage = function(damage) {
        health -= damage;

        if(health <= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    const canProduce = function() {
        if(timer >= sun_produce_time) {
            timer = 0;
            return true;
        }
        else {
            return false;
        }
        
    }

    const getPlantType = function() {
        return 1;
    }

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequence)
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/sunflower_sprite_cut.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,

        plantUpdate,
        takeDamage,
        canProduce,
        getPlantType
    };
};
