ig.module(
	'game.entities.toothbrush'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityToothbrush = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 6, y: 25},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "Toothbrush",
    
    animSheet: new ig.AnimationSheet( 'media/items/toothbrush.png', 6, 25 ),
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
            ig.game.player.brushedTeeth = true;
            this.active = false;
            this.currentAnim.angle = (-90).toRad();
            ig.game.gui.setNotificationText("You brushed your teeth.");
        }
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