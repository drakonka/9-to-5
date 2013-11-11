ig.module(
	'game.entities.fishbowl'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityFishbowl = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 60, y: 40},
    offset: {x: 0, y: 20},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,

    feed: 0,

    displayHoverText: false,
    hoverText: "Feed goldfish",

    animSheet: new ig.AnimationSheet( 'media/items/fishbowl.png', 60, 60 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.anims.brewing = new ig.Animation( this.animSheet, 0.2, [1,2]);
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
            this.feed++;
            ig.game.gui.setNotificationText("You fed your goldfish");
        }
    },

    kill: function() {
        ig.game.controller.fishFeed = this.feed;
        this.parent();
    },

    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
    },

    draw: function() {
        this.parent();
        if (this.displayHoverText && this.active) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});