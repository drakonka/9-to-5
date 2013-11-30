ig.module(
	'game.entities.coffeecup'
)
.requires(
	'impact.entity'
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
    zIndex: 50,

    specialSound: new ig.Sound( 'media/audio/coffeesip.*' ),

    displayHoverText: false,
    hoverText: "Coffee",
    
    animSheet: new ig.AnimationSheet( 'media/items/coffeecup.png', 24, 20 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.minItemUseDistance = ig.game.gui.minItemUseDistance;
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
                ig.game.player.coffeeDrunk += 1;
                ig.game.gui.setNotificationText("You drank a cup of coffee.");
                this.specialSound.play();
                this.kill();
            }
            else {
                if (!this.pickedUp && ig.game.player.activeQuest === 2) {
                    this.pickedUp = true;
                    ig.game.player.holding = this;
                }
                else {
                    if (ig.game.player.activeQuest === 2) {
                        this.pickedUp = false;
                        ig.game.player.holding = null;
                    }
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