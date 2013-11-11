ig.module(
	'game.entities.elevator'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityElevator = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 80, y: 215},
    offset: {x: 0, y: 0},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 0,

    movementRange: 250,
    downstairs: true,
    running: false,
//    slowdown: -50,

    displayHoverText: false,
    hoverText: "Use elevator",

    animSheet: new ig.AnimationSheet( 'media/items/elevator.png', 80, 215 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.anims.opening = new ig.Animation( this.animSheet, 0.1, [0,1,2,3]);
        this.anims.closing = new ig.Animation( this.animSheet, 0.1, [3,2,1,0]);

        this.currentAnim = this.anims.idle;
    },

    clicked: function() {
        if (this.active) {
            console.log('running yo');
            this.active = false;
            this.running = true;
            this.currentAnim = this.anims.opening.rewind();;
            this.zIndex = 0;
            ig.game.sortEntitiesDeferred();
            ig.game.player.pos.x = this.pos.x;
        }
    },


    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (this.running) {
            if (this.currentAnim === this.anims.opening && this.currentAnim.frame > 2) {
                console.log('opening ' + this.currentAnim.frame);

                this.currentAnim = this.anims.closing;
            }
            else if (this.currentAnim === this.anims.closing && this.currentAnim.frame > 2) {
                console.log('closing ' + this.currentAnim.frame);

                this.currentAnim = this.anims.idle;
            }

            var topPosition = ig.system.height - 20 - this.movementRange;
            var bottomPosition = 780 - this.size.y;

            if (this.downstairs) {
                if (this.pos.y > topPosition) {
                    this.pos.y -= 1;
                }
                else {
                    this.running = false;
                    this.downstairs = false;
                    this.active = true;
                }
            }
            else if (!this.downstairs) {
                if (this.pos.y <= bottomPosition) {
                    this.pos.y += 1;
                }
                else {
                    console.log('stopping');
                    this.running = false;
                    this.downstairs = true;
                    this.active = true;
                }
            }
            ig.game.player.pos.y = this.pos.y;
            ig.game.player.pos.x = this.pos.x;
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