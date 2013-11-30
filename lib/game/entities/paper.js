ig.module(
	'game.entities.paper'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityPaper = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 24, y: 20},
    gravityFactor: 0,
    zIndex: 15,

    clickable: false,
    active: true,
    angerLevel: 0,
//    slowdown: -50,

    stapled: false,

    displayHoverText: false,
    hoverText: "",
    
    animSheet: new ig.AnimationSheet( 'media/items/paper.png', 24, 20 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setAnimations();
        if (this.pickedUp) {
            ig.game.player.holding = this;
        }
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
     /*   if (this.active) {
            this.active = false;
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
        } */
    },
	
   
    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (ig.game.player.holding === this) {
            if (!ig.game.player.currentAnim.flip.x) {
              this.pos.x = ig.game.player.pos.x + ig.game.player.size.x - 20;
            }
            else {
                this.pos.x = ig.game.player.pos.x + 10;
            }
            this.pos.y = ig.game.player.pos.y + ig.game.player.size.y / 2;
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