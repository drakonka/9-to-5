ig.module(
	'game.entities.alarmclock'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityAlarmclock = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 50, y: 50},
    offset: {x: 10, y: 20},
    gravityFactor: 0,

    clickable: true,
    active: true,
    angerLevel: 1,
    gradualAngerIncrease: true,
    angerIncreaseSpeed: 1,
    angerIncreaseTimer: null, 

    displayHoverText: false,
    hoverText: "Stop Alarm",
    ringing: true,


    animSheet: new ig.AnimationSheet( 'media/items/alarmclock.png', 60, 70 ),
	init: function(x, y, settings) {
        this.minItemUseDistance = 500;
        this.angerIncreaseTimer = new ig.Timer(this.angerIncreaseSpeed);

        this.parent(x, y, settings);
        if (!ig.global.wm) {
            ig.music.volume = 1;
            ig.music.play('alarmmusic');
        }
        this.setAnimations();
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.1, [0] );
        this.anims.ringing = new ig.Animation( this.animSheet, 0.5, [1,2] );
        this.currentAnim = this.anims.idle;
     
    },

    clicked: function() {
        var player = ig.game.player;
        if (player.sleeping && this.ringing) {
            player.yawnSound.play();
            ig.music.stop('alarmmusic');
            ig.music.volume = 0.05;
            ig.music.play('bgmusic');
            ig.music.loop = true;
            this.ringing = false;
            player.sleeping = false;
            player.size.y = 200;
            player.pos.y -= 120;
            player.pos.x += 210;
            player.offset.x = 55;
            player.offset.y -= 120;
            player.currentAnim.angle = (0).toRad();
            this.hoverText = "Set Alarm";

        }
        else if (player.activeQuest === 11) {
            ig.game.player.currentAnim.angle = (-90).toRad();
            this.ringing = false;
            player.sleeping = true;
            player.currentAnim.angle = (-90).toRad();
            player.offset.y += 120;
            player.size.y = player.size.x + 5;
            player.offset.x = 0;
            player.pos.x -= 210;
            this.hoverText = "Stop Alarm";
        }
    },
 
   
    update: function() {
        this.parent();
        if (this.ringing && this.currentAnim !== this.anims.ringing) {
            this.currentAnim = this.anims.ringing;
        }
        else if (!this.ringing && this.currentAnim !== this.anims.idle) {
            this.currentAnim = this.anims.idle;
        }

        if (this.ringing && this.angerIncreaseTimer.delta() > 0) {
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