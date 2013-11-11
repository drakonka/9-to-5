ig.module(
	'game.entities.trashcan'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
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
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "Trashcan",
    
    animSheet: new ig.AnimationSheet( 'media/items/trashcan.png', 45, 77 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
    //    ig.game.bananapeel = this;
    //    if (!ig.global.wm) {
    //        ig.game.steppableEntitiesArr.push(this);
    //    }
        this.setAnimations();
        // Male animations
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
        }
    },
	
    check: function(other) {
        ig.game.gui.setNotificationText("You've thrown away litter.");
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