// This function defines the Wallnut module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the wallnut
// - `y` - The initial y position of the wallnut
const Zombie = function(ctx, x, y, state, gameArea) {

    // This is the sprite sequence of the fire
    const sequences = {
        healthy_walking:   {x: 6,   y: 0, width: 32, height: 50, count: 11, timing: 200, loop: true},
        healthy_eating:    {x: 366, y: 0, width: 36, height: 50, count: 7 , timing: 200, loop: true},
        unhealthy_walking: {x: 366+252+180,   y: 0, width: 30, height: 50, count: 5, timing: 200, loop: true},
        unhealthy_eating:  {x: 1015, y: 0, width: 37, height: 50, count: 7 , timing: 200, loop: true},
        dead:              {x: 1694,   y: 0, width: 32, height: 40, count: 5, timing: 400, loop: false}
    };

    // This is the sprite object of the fire created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the fire sprite here.
    sprite.setSequence(sequences[state])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("sprite/zombie_sprite.png");


    // This is the moving motion, which can be a number from 0 to 1:
    // - `0` - moving
    // - `1` - eating
    let motion = 0;

    /* can change!!!!! */
    let speed = 10;
    let health = 10;


    let normal = true;
    let attacking = false;
    let attackCD = 0

    let halfHealth = false;
    let noHealth = false;
    let calledSplice = false;

    const setHealth = function(newHealth) {
        health = newHealth;
    }

    const zombieUpdate = function(time, isAttacking) {

        attackCD++;

        // High HP & not attacking
        if (!attacking && !isAttacking) {
            
            if(!normal) {
                sprite.setSequence(sequences.healthy_walking);
                attacking = false;
                normal = true;
            }
            
        }

        // High HP & start attacking
        if (!attacking && isAttacking) {
            sprite.setSequence(sequences.healthy_eating);
            attacking = true;
            speed = 0;

            normal = false;
        }

        // Low HP & walking
        if (!halfHealth && health <= 10 && !isAttacking) {
            sprite.setSequence(sequences.unhealthy_walking);
            halfHealth = true;
            speed = 10;
        }

        // Low HP & start attacking
        if (!halfHealth && !attacking && isAttacking) {
            sprite.setSequence(sequences.healthy_eating);
            attacking = true;
            halfHealth = true;
            speed = 0;
        }

        // Dead
        if(!noHealth && health <= 0) {
            sprite.setSequence(sequences.dead);
            noHealth = true;
            speed = 0;
        }

        // Adjust x position
        x -= speed / 60;

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y)) {
            sprite.setXY(x, y);
        }
        else {
            sprite.setXY(1000, 1000);
        }
      
        /* Update the sprite object */
        sprite.update(time);
    };

   
    const canAttack = function() {
        if(attackCD >= 50) {
            //console.log("zombie attack!");
            attackCD = 0;
            return true;
        }
        else {
            return false;
        }
    }

    const resetAttack = function() {
        attacking = false;
        speed = 10;
    }

    const takeDamage = function(damage) {
        health -= damage;
    }

    const isdead = function() {
        if(health <= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    // This function only called once when HP drops to 0,
    // and trigger the dead sprites
    const callSplice = function() {
        if(!calledSplice) {
            calledSplice = true;
            return true;
        }
        else {
            return false;
        }
    }


    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        draw: sprite.draw,
        update: sprite.update,
        
        setHealth,
        zombieUpdate,
        getBoundingBox: sprite.getBoundingBox,
        canAttack,
        resetAttack,
        takeDamage,
        isdead,
        callSplice
        
    };
};
