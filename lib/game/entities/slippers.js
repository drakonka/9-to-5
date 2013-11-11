ig.module(
	'game.entities.slippers'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntitySlippers = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 40, y: 15},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "Slippers",
    
    animSheet: new ig.AnimationSheet( 'media/items/slippers.png', 40, 15 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
            ig.game.player.wearingSlippers = true;
            this.active = false;
            ig.game.gui.setNotificationText("You put on your slippers");
            ig.game.player.setHumanAnimations(ig.game.player.slippersAnimSheet, 0.1);

            this.kill();
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