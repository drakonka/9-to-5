ig.module(
	'game.entities.slippers'
)
.requires(
	'impact.entity'
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

    displayHoverText: false,
    hoverText: "Slippers",
    
    sound: new ig.Sound( 'media/audio/slippers.*' ),

    animSheet: new ig.AnimationSheet( 'media/items/slippers.png', 40, 15 ),
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
        if (this.active && !ig.game.player.dressed) {
            ig.game.player.wearingSlippers = true;
            this.active = false;
            ig.game.gui.setNotificationText("You put on your slippers");
            ig.game.player.setAnimations(ig.game.player.slippersAnimSheet, 0.1);
            this.kill();
        }
        else if (ig.game.player.dressed) {
            ig.game.gui.setNotificationText("You are already wearing clothes.");
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