ig.module(
	'game.entities.coffeemachine'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityCoffeemachine = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 35, y: 40},
    offset: {x: 0, y: 20},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,

    displayHoverText: false,
    hoverText: "Coffee maker",

    animSheet: new ig.AnimationSheet( 'media/items/coffeemachine.png', 35, 60 ),

    sound: new ig.Sound( 'media/audio/coffeemachine.*' ),

	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
        }
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.anims.brewing = new ig.Animation( this.animSheet, 0.2, [1,2]);
        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
            this.active = false;
            this.coffeeTimer = new ig.Timer(5);
            this.currentAnim = this.anims.brewing;
        }
    },


    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (this.coffeeTimer && this.coffeeTimer.delta() > 0) {
            this.active = true;
            this.coffeeTimer = null;
            this.currentAnim = this.anims.idle;
            ig.game.spawnEntity(EntityCoffeecup, this.pos.x + this.size.x + 3, this.pos.y + 20);
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