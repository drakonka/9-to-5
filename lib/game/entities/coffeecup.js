ig.module(
	'game.entities.coffeecup'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityCoffeecup = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 24, y: 20},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "Coffee",
    
    animSheet: new ig.AnimationSheet( 'media/items/coffeecup.png', 24, 20 ),
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
            this.active = false;
            if (ig.game.player.location != 'office') {
                ig.game.player.coffeeDrunk += 2;
                ig.game.gui.setNotificationText("You drank a cup of coffee.");
                this.kill();
            }
            else {
                if (!this.pickedUp) {
                    this.pickedUp = true;
                    ig.game.player.holding = this;
                }
                else {
                    this.pickedUp = false;
                    ig.game.player.holding = null;
                }
            }
        }
    },
	
   
    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (this.pickedUp && ig.game.player.holding === this) {
            if (!ig.game.player.currentAnim.flip.x) {
              this.pos.x = ig.game.player.pos.x + ig.game.player.size.x - 5;
            }
            else {
                this.pos.x = ig.game.player.pos.x;
            }
            this.pos.y = ig.game.player.pos.y + ig.game.player.size.y / 2 - 15;
        }
       
    },
    
    draw: function() {
        this.parent();
        if (this.displayHoverText && this.active) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});