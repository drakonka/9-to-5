ig.module(
	'game.entities.bananapeel'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityBananapeel = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 25, y: 25},
    gravityFactor: 1,

    clickable: false,
    active: false,
    angerLevel: 5,
    slowdown: 50,
    zIndex: 600,

    displayHoverText: false,
    hoverText: "Banana peel",

    firstSpawn: true,
    pickedUp: false,
    
    animSheet: new ig.AnimationSheet( 'media/items/bananapeel.png', 25, 25 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        ig.game.bananapeel = this;
        if (!ig.global.wm) {
            ig.game.steppableEntitiesArr.push(this);
        }
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (!this.pickedUp) {
            this.pickedUp = true;
            ig.game.player.holding = this;
        }
        else {
            this.pickedUp = false;
            ig.game.player.holding = null;
        }
    },

    check: function(other) {
        if (this.active && !this.pickedUp) {
            if (other instanceof EntityPlayer) {
                this.active = false;
                other.anger += this.angerLevel;
                if (!other.slow) {
                    other.slow = true;
                    other.speed -= this.slowdown;
                    other.slowTimer.reset();
                    ig.game.gui.setNotificationText("You slipped on your own banana peel.");
                }
            }
        }
    },
   
    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (this.firstSpawn && !this.touches(ig.game.player)) {
            this.firstSpawn = false;
            this.active = true;
            this.clickable = true;
        }
        if (this.pickedUp) {            
            if (!ig.game.player.currentAnim.flip.x) {
              this.pos.x = ig.game.player.pos.x + ig.game.player.size.x - 25;
            }
            else {
                this.pos.x = ig.game.player.pos.x - 25;
            }
            this.pos.y = ig.game.player.pos.y + ig.game.player.size.y / 2 - 15;
        }
    },

    draw: function() {
        this.parent();
        if (this.displayHoverText) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});