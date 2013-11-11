ig.module(
	'game.entities.passerby'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityPasserby = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 45, y: 200},
    offset: {x: 20, y: 0},
    gravityFactor: 1,
    steppingUp: false,
    active: true,
   // zIndex: 499,
  

    holding: null,

    // Movement
    maxVel: {x: 150, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,
    speed: 200,
    maxSpeed: 150,
    jumpStrength: 400,

    slowdown: 150,
    angerLevel: 10,

    // Anger
    flip: true,
    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/player.png', 100, 200 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.slowdown = ig.game.player.speed / 1.5;
        this.speed = ig.game.controller.randomFromTo(100,this.maxVel.x);
        this.pos.x = 3741;
     //   this.pos.x = ig.game.controller.randomFromTo(3300);
        this.vel.x = -this.speed;
      /*  if (!ig.global.wm) {
            ig.game.steppableEntitiesArr.push(this);
        } */
        this.setHumanAnimations();

    },

    setHumanAnimations: function() {
        this.anims.idle = new ig.Animation( this.humanAnimSheet, 0.1, [0] );
        this.anims.walking = new ig.Animation (this.humanAnimSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] );
        this.currentAnim = this.anims.walking;
        this.currentAnim.flip.x = true;
    },
	
   
    update: function() {
      //  this.setCurrentAnim();
        ig.game.controller.killOffScreen(this, true);
        this.parent();
    },

    kill: function() {
        if (ig.game.player.location === 'outside' && ig.game.player.pos.x < 3700) {
            ig.game.spawnEntity(EntityPasserby, 0, this.pos.y);
        }
        this.parent();
    },

    setCurrentAnim: function() {
        if (this.vel.x !== 0) {
            if (this.currentAnim !== this.anims.walking) {
                this.currentAnim = this.anims.walking;
            }
        }
        else {
            this.currentAnim = this.anims.idle;
        }
        this.currentAnim.flip.x = this.flip;

    },

    check: function(other) {
        if (this.active && other instanceof EntityPlayer) {
            if (Math.abs(other.vel.x) > 10) {
                this.active = false;
                other.anger += this.angerLevel;
                other.slow = true;
                other.speed -= this.slowdown; 
                other.slowTimer.reset();
                ig.game.gui.setNotificationText("You collide with a passerby.");        
            }
        }
      //  console.log('smet')
        
      //  this.parent();
    },

    draw: function() {
        this.parent();
    }

});

});