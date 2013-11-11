ig.module(
	'game.entities.stapler'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityStapler = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 40, y: 20},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 1,
    gradualAngerIncrease: true,
    angerIncreaseSpeed: 1,
    angerIncreaseTimer: null, 

    displayHoverText: false,
    hoverText: "Stapler",
      //  slowdown: -50,
    
    animSheet: new ig.AnimationSheet( 'media/items/stapler.png', 40, 20 ),
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
        if (ig.game.player.holding instanceof EntityPaper) {
            ig.game.gui.setNotificationText("You stapled the papers");
            ig.game.player.holding.stapled = true;
        }
        else {
            ig.game.gui.setNotificationText("You staple your fingers");
            ig.game.player.anger++;
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