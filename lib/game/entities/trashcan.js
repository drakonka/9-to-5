ig.module(
	'game.entities.trashcan'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityTrashcan = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.B,

   
    size: {x: 45, y: 77},
    gravityFactor: 1,

    clickable: true,
    active: true,
    angerLevel: 0,

    displayHoverText: false,
    hoverText: "Trashcan",
    
    specialSound: new ig.Sound( 'media/audio/throwtrash.*' ),


    animSheet: new ig.AnimationSheet( 'media/items/trashcan.png', 45, 77 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
        }
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
            if (ig.game.player.holding instanceof EntityBananapeel) {
                ig.game.player.holding.pickedUp = false;
                ig.game.player.holding = null;

            }
        }
    },
	
    check: function(other) {
        ig.game.gui.setNotificationText("You've thrown away litter.");
        this.specialSound.play();
        other.kill();
    },
   
    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);

    },
    
    draw: function() {
        this.parent();
        if (this.displayHoverText) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});