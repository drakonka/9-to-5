ig.module(
	'game.entities.fishbowl'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityFishbowl = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 60, y: 60},
    offset: {x: 0, y: 0},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,

    feed: 0,
    maxFeed: 5,

    displayHoverText: false,
    hoverText: "Feed goldfish",

    sound: new ig.Sound( 'media/audio/fishfeed.*' ),


    animSheet: new ig.AnimationSheet( 'media/items/fishbowl.png', 60, 60 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
            this.setAnimations();
        }
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.2, [0,1,2,3,4,5,6,7,8,9] );
        this.anims.dead = new ig.Animation( this.animSheet, 0.5, [10,11]);
        if (!ig.game.controller.fishDied) {
            this.currentAnim = this.anims.idle;
        }
        else {
            this.currentAnim = this.anims.dead;
            this.active = false;
        }
    },

    clicked: function() {
        if (this.active) {
            this.feed++;
            if (this.feed > this.maxFeed) {
                ig.game.gui.setNotificationText("You overfed your goldfish and it died");
                ig.game.controller.fishDied = true;
                this.currentAnim = this.anims.dead;
            }
            else {
                ig.game.gui.setNotificationText("You fed your goldfish");
                ig.game.controller.fishFed = true;
            }
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