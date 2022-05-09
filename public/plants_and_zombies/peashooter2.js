// This function defines the Peashooter2 module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the peashooter2
// - `y` - The initial y position of the peashooter2
const Peashooter2 = function(ctx, x, y) {

    // This is the sprite sequence of the fire
    const sequence = {x: 0, y: 0, width: 35, height: 34, count: 5, timing: 250, loop: true};

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    /* can change!!!!! */
    let attack_cooldown = 150;
    let attack2_cooldown = 25;
    let health = 10;

    let timer = 0

    let attack2 = false;

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
    
    const needAttack = function() {

        if (attack2) {
            if(timer >= attack2_cooldown) {
                timer = 0;
                attack2 = false;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if(timer >= attack_cooldown) {
                timer = 0;
                attack2 = true;
                return true;
            }
            else {
                return false;
            }
        }
    };

    const getPlantType = function() {
        return 3;
    }

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequence)
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/peashooter2_sprite_cut.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,

        plantUpdate,
        takeDamage,
        needAttack,
        getPlantType
    };
};
