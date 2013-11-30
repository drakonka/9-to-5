ig.module(
	'game.entities.explosion'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityExplosion = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 1, y: 1},
    offset: {x: 256 / 2, y: 256 / 2 },

    gravityFactor: 0,

    clickable: false,
    active: true,
    angerLevel: 0,
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "BOOOOOOOOOOM",
    
    animSheet: new ig.AnimationSheet( 'media/characters/explosion.png', 256, 256 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.05, [0,1,2,3,4,5,6] );
        this.currentAnim = this.anims.idle;
    },


   
    update: function() {
        this.parent();
        if (this.currentAnim.frame >= 6) {
            this.kill();
        }
       
       
    },
    
    kill: function() {
        this.parentEntity.kill();
        this.parent();
    },

    draw: function() {
        this.parent();
        if (this.displayHoverText && this.active) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});