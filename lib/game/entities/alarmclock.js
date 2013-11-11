ig.module(
	'game.entities.alarmclock'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityAlarmclock = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 50, y: 50},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 1,
    gradualAngerIncrease: true,
    angerIncreaseSpeed: 1,
    angerIncreaseTimer: null, 

    displayHoverText: false,
    hoverText: "Alarm Clock",
      //  slowdown: -50,
    
    animSheet: new ig.AnimationSheet( 'media/items/alarmclock.png', 50, 50 ),
 //   femaleAnimSheet: new ig.AnimationSheet( 'media/femaleotherflea.png', 31, 31 ),
	init: function(x, y, settings) {
        this.angerIncreaseTimer = new ig.Timer(this.angerIncreaseSpeed);

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
        this.active = false;
        if (ig.game.player.sleeping) {
            ig.game.player.sleeping = false;
            ig.game.player.size.y = 200;
            ig.game.player.pos.y -= 100;
            ig.game.player.pos.x += 200;
            ig.game.player.offset.x = 40;
            ig.game.player.offset.y -= 45;
            ig.game.player.currentAnim.angle = (0).toRad();
        }
    },
 
   
    update: function() {
        this.parent();
        if (this.active && this.angerIncreaseTimer.delta() > 0) {
            ig.game.player.anger += this.angerLevel;
            this.angerIncreaseTimer.reset();
        }
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