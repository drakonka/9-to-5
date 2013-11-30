ig.module(
	'game.entities.helicopter'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityHelicopter = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 300, y: 119},
    offset: {x: 0, y: 0},
    gravityFactor: 0,
    active: true,
  
    // Movement
    maxVel: {x: 400, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,
    speed: 270,
    lowestPoint: 150,
    highestPoint: 0,

    firing: false,
    firingTimer: new ig.Timer(0.07),

    flip: true,
    minProximity: 500,
    dependentsArr: [],
    
    sound: new ig.Sound( 'media/audio/helicopter.*' ),


    animSheet: new ig.AnimationSheet( 'media/characters/helicopter.png', 300, 119 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.lowestPoint = 500;
        this.highestPoint = 100;
        this.pos.y = ig.game.player.pos.y - 300;
        this.setAnimations();
        this.sound.play();
        this.sound.loop = true;
        if (!this.sound.currentClip.iloop) {
            this.sound.currentClip.iloop = true;
            this.sound.currentClip.addEventListener( 'ended', (function(){
                this.currentTime = 0;
                this.play();
            }).bind(this.sound.currentClip), false );
        }
        this.vel.y = this.speed / 4;
    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.05, [0,1] );
        this.anims.firing = new ig.Animation (this.animSheet, 0.05, [1,2] );
        this.currentAnim = this.anims.idle;
        this.currentAnim.flip.x = true;
    },
	
   
    update: function() {
        this.parent();
        this.checkDirection();
        this.moveToPlayer();
        this.currentAnim.flip.x = this.flip;
        if (this.firing && this.firingTimer.delta() > 0) {
            this.firingTimer.reset();
            var velX;
            var posX;
            if (this.flip) {
                velX = 2000;
                posX = this.pos.x + this.size.x / 2 + 100;
            }
            else {
                velX = -2000;
                posX = this.pos.x + this.size.x / 2 - 100;
            }
            ig.game.spawnEntity(EntityBullet, posX, this.pos.y + this.size.y / 2 + 40, {vel: {x: velX, y: 0}});
        }
    },

    checkDirection: function() {
        if (this.pos.x > ig.game.player.pos.x) {
            this.flip = false;
        }
        else {
            this.flip = true;
        }
    },

    toggleFiring: function(action) {
        if (action === 'start') {
            this.firingTimer.reset();
            this.firing = true;
            this.currentAnim = this.anims.firing;

        }
        else {
            this.firing = false;
            this.currentAnim = this.anims.idle;
        }
    },

    moveToPlayer: function() {
        var proximity = this.distanceTo(ig.game.player);
        var firingDistance = 300;
        if (proximity > this.minProximity) {
            var r = Math.atan2(ig.game.player.pos.y-this.pos.y, ig.game.player.pos.x-this.pos.x);
            var velx =  Math.cos(r) * this.speed;
            this.vel.x = velx;
        }
        if (this.pos.y > this.lowestPoint - this.size.y / 2) {
            if (proximity > firingDistance) {
                if (this.firing) {
                    this.toggleFiring('stop');
                }

            }
            else if (!this.firing) {
                this.toggleFiring('start');
            }
        }
        var vely = this.speed / 4;

        if (this.pos.y <= this.highestPoint) {
            this.vel.y = vely;
        }
        else if (this.pos.y >= this.lowestPoint) {
            if (!this.lingerTimer) {
                this.lingerTimer = new ig.Timer(3);
                this.vel.y = 0;
            }
            else if (this.lingerTimer.delta() > 0) {
                this.lingerTimer = null;
                this.vel.y = -vely;
            }
        }

    },

    kill: function() {
        this.sound.stop();

        this.parent();

    },
    check: function(other) {
    },


    draw: function() {
        this.parent();
    }

});

ig.global.EntityBullet = ig.Entity.extend({
    collides: ig.Entity.COLLIDES.ACTIVE,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 10, y: 10},
    offset: {x: 0, y: 0},
    gravityFactor: 0,
    active: true,
    zIndex: 499,
  
    // Movement
    maxVel: {x: 2000, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,

    // Anger
    flip: true,
    minProximity: 500,
    dependentsArr: [],

    sound: new ig.Sound( 'media/audio/shot.*' ),

    
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.sound.play();
    },    
   
    update: function() {
        ig.game.controller.killOffScreen(this);
        this.parent();

    },


    handleMovementTrace: function( res ) {
        if (res.collision.x) {
            this.kill();
        }        
        this.parent(res);
    },
    

    check: function(other) {
        if (other instanceof EntityPlayer) {
            other.receiveDamage(1, this);
            this.kill();
        }
    },


    draw: function() {
        ig.game.ctx.fillStyle = "#ff0000";
        ig.game.ctx.beginPath();
        ig.game.ctx.arc(this.pos.x - ig.game.screen.x,this.pos.y - ig.game.screen.y,this.size.x / 2,0,2*Math.PI);
        ig.game.ctx.fill();
    }

});

});