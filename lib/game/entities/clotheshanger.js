ig.module(
	'game.entities.clotheshanger'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityClotheshanger = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 70, y: 200},
    offset: {x: 0, y: 0},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,

    feed: 0,

    displayHoverText: false,
    hoverText: "Clothes hanger",

    sound: new ig.Sound( 'media/audio/clothes.*' ),

    animSheet: new ig.AnimationSheet( 'media/items/clotheshanger.png', 70, 200 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
            this.setAnimations();
        }
    },

    setAnimations: function() {
        this.anims.clothes = new ig.Animation( this.animSheet, 0.1, [1] );
        this.anims.noclothes = new ig.Animation( this.animSheet, 0.1, [0]);
        if (!ig.game.controller.dressed) {
            this.currentAnim = this.anims.clothes;
        }
        else {
            this.currentAnim = this.anims.noclothes;
        }
    },

    clicked: function() {
        if (this.active) {
            if (!ig.game.player.dressed) {
                ig.game.gui.setNotificationText("You put on your clothes");
                ig.game.player.dressed = true;
                ig.game.player.setAnimations(ig.game.player.dressedAnimSheet, 0.05);
                this.currentAnim = this.anims.noclothes;
            }
            else {
                ig.game.gui.setNotificationText("You remove your clothes");
                ig.game.player.dressed = false;
                if (ig.game.player.wearingSlippers) {
                    ig.game.player.setAnimations(ig.game.player.slippersAnimSheet, 0.1);
                }
                else {
                    ig.game.player.setAnimations(ig.game.player.nudeAnimSheet, 0.1);

                }
                this.currentAnim = this.anims.clothes;
             }
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