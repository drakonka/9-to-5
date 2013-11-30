ig.module(
	'game.entities.puddle'
)
.requires(
	'impact.entity'
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

    sound: new ig.Sound( 'media/audio/puddle.*' ),

    
    animSheet: new ig.AnimationSheet( 'media/items/puddle.png', 100, 7 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            ig.game.steppableEntitiesArr.push(this);
        }
        this.setAnimations();
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
                this.sound.play();
                if (!other.slow) {
                    other.slow = true;
                    other.speed -= this.slowdown;
                    other.slowTimer.reset();
                }
                ig.game.gui.setNotificationText("You're not wearing slippers\nand step in a cold puddle.");
            }
        }
    },
   
    update: function() {
        this.parent();

    },
    
    draw: function() {
        this.parent();
        if (this.displayHoverText) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});