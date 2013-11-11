ig.module(
	'game.entities.puddle'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityPuddle = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 100, y: 7},
    gravityFactor: 1,

    active: true,
    angerLevel: 5,
    slowdown: 50,

    displayHoverText: false,
    hoverText: "Puddle",
    
    animSheet: new ig.AnimationSheet( 'media/items/puddle.png', 100, 7 ),
 //   femaleAnimSheet: new ig.AnimationSheet( 'media/femaleotherflea.png', 31, 31 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            ig.game.steppableEntitiesArr.push(this);
        }
        this.setAnimations();
        // Male animations
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },
	

    check: function(other) {
        if (this.active) {
            if (other instanceof EntityPlayer && !other.wearingSlippers) {
                this.active = false;
                other.anger += this.angerLevel;
                if (!other.slow) {
                    other.slow = true;
                    other.speed -= this.slowdown;
                    other.slowTimer.reset();
                    console.log('making slow');
                }
            /*    if (other.speed === other.maxSpeed) {
                    other.speed += other.slowdown;
                    other.vel.x = other.speed;

                } */
          //      console.log('colliding with banana peel');
            //    this.stepUp(other.size.y);
                ig.game.gui.setNotificationText("You're not wearing slippers\nand step in a cold puddle.");
            }
        }
    },
   
    update: function() {
        this.parent();
     //   this.displayHoverText = ig.game.gui.checkItemHover(this);

    },
    
    draw: function() {
        this.parent();
        if (this.displayHoverText) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});