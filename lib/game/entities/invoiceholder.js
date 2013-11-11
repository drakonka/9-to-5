ig.module(
	'game.entities.invoiceholder'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityInvoiceholder = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 55, y: 10},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 1,
    gradualAngerIncrease: true,
    angerIncreaseSpeed: 1,
    angerIncreaseTimer: null, 

    displayHoverText: false,
    hoverText: "Cheque Holder",
      //  slowdown: -50,
    
    animSheet: new ig.AnimationSheet( 'media/items/invoiceholder.png', 55, 10 ),
 //   femaleAnimSheet: new ig.AnimationSheet( 'media/femaleotherflea.png', 31, 31 ),
	init: function(x, y, settings) {

        this.parent(x, y, settings);
    //    ig.game.touchableEntitiesArr.push(this);
        this.setAnimations();
     //   this.angerIncreaseTimer = new ig.Timer(this.angerIncreaseSpeed);

        // Male animations
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.currentAnim = this.anims.idle;
     
    },

    clicked: function() {
        console.log('clicked');
        if (this.active && ig.game.player.activeQuest === 10 && ig.game.player.holding instanceof EntityPaper) {
            if (ig.game.clockHour > this.targetHour) {
                ig.game.player.lateDelivery = true;
            }
            else {
                ig.game.player.lateDelivery = false;
            }
            this.active = false;
            ig.game.player.holding.kill();
            ig.game.player.holding = null;
            ig.game.gui.setNotificationText("You delivered the invoices.");
        }
    },
 
   
    update: function() {
        this.parent();
       
        this.displayHoverText = ig.game.gui.checkItemHover(this);
    },
    
    draw: function() {
        this.parent();
        if (this.displayHoverText) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});