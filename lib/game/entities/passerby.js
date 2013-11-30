ig.module(
	'game.entities.passerby'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityPasserby = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,
   
    size: {x: 25, y: 200},
    offset: {x: 55, y: 0},
    gravityFactor: 1,
    steppingUp: false,
    active: true,

    holding: null,

    // Movement
    maxVel: {x: 150, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,
    speed: 200,
    maxSpeed: 150,

    slowdown: 150,
    angerLevel: 10,

    turned: false,
    // Anger
    flip: true,
    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/commuter.png', 143, 225 ),
	init: function(x, y, settings) {

        this.parent(x, y, settings);
        this.slowdown = ig.game.player.speed / 1.5;
        this.speed = ig.game.controller.randomFromTo(100,this.maxVel.x);
        if (this.pos.x === 3741) {
            this.speed = -this.speed;
            this.vel.x = this.speed;
            this.flip = true;
        }
        else {
            this.vel.x = this.speed;
            this.flip = false;
        }
      /*  if (!ig.global.wm) {
            ig.game.steppableEntitiesArr.push(this);
        } */
        this.setHumanAnimations();

    },

    setHumanAnimations: function() {
        this.anims.idle = new ig.Animation( this.humanAnimSheet, 0.05, [16] );
        this.anims.walking = new ig.Animation (this.humanAnimSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] );
        this.currentAnim = this.anims.walking;
    },
	
   
    update: function() {
        if (this.pos.x > 3741) {
            this.kill();
        }
        else if (this.pos.x < 2000) {
            this.kill();
        }
        if (ig.game.player.isWerewolf) {
            if (this.active) {
                if (this.distanceTo(ig.game.player) <= 100) {
                    this.active = false;
                    ig.game.player.attackSound.play();
                    this.explode();
                }
                else if (this.distanceTo(ig.game.player) <= 250) {
                    if (!this.turned) {
                        if (ig.game.player.vel.x  > 0 && this.vel.x < 0 || ig.game.player.vel.x < 0 && this.vel.x > 0 || ig.game.player.vel.x === 0) {
                            ig.game.screamSound.play();
                            this.turned = true;
                            this.speed = -this.speed;
                            this.vel.x = this.speed;
                            this.flip = !this.flip;
                        }
                    }
      
                } 
                else {
                    if (this.turned) {
                        this.turned = false;
                    }
                }
            
            }
        }
        this.currentAnim.flip.x = this.flip;
        this.parent();
    },

    kill: function() {
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

    explode: function() {
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
    },


    check: function(other) {
        if (this.active && other instanceof EntityPlayer) {
            if (!other.isWerewolf) {
                if (Math.abs(other.vel.x) > 10) {
                    this.active = false;
                    var rand = ig.game.controller.randomFromTo(0,other.collisionSoundArr.length - 1);
                    var soundToPlay = other.collisionSoundArr[rand];
                    soundToPlay.play();


                    other.anger += this.angerLevel;
                    other.slow = true;
                    other.speed -= this.slowdown; 
                    other.slowTimer.reset();
                    ig.game.gui.setNotificationText("You collide with a passerby.");        
                }
            }
            else {
                this.active = false;
                other.attackSound.play();
                this.explode();
            }
        }
    },

    draw: function() {
        this.parent();
    }

});

});