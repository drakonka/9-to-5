ig.module(
	'game.entities.banana'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityBanana = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 25, y: 25},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: -5,

    displayHoverText: false,
    hoverText: "Banana",
    
    animSheet: new ig.AnimationSheet( 'media/items/banana.png', 25, 25 ),
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
            ig.game.player.ateBanana = true;    
            ig.game.gui.setNotificationText("Ate a banana");
            ig.game.spawnEntity(EntityBananapeel, ig.game.player.pos.x + ig.game.player.size.x / 2, this.pos.y);
            this.kill();
        }
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