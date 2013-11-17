ig.module(
	'game.entities.helicopter'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
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
   // zIndex: 499,
  
    // Movement
    maxVel: {x: 400, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,
    speed: 300,
    lowestPoint: 150,
    highestPoint: -50,

    firing: false,


    // Anger
    flip: true,
    minProximity: 500,
    dependentsArr: [],
    
    animSheet: new ig.AnimationSheet( 'media/characters/helicopter.png', 300, 119 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.lowestPoint = ig.game.player.pos.y;
        this.highestPoint = ig.game.player.pos.y - 200;
        this.pos.y -= ig.game.player.pos.y - 400;
        this.setAnimations();

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

    },

    checkDirection: function() {
        if (this.pos.x > ig.game.player.pos.x) {
            this.flip = false;
        }
        else {
            this.flip = true;
        }
    },

    fire: function(action) {
        if (action === 'start') {
            this.firing = true;
            this.currentAnim = this.anims.firing;

        }
        else {
            this.firing = false;
            this.currentAnim = this.anims.idle;
        }
    }

    moveToPlayer: function() {
        var proximity = this.distanceTo(ig.game.player);
        if (proximity > this.minProximity) {
            if (this.firing) {
                this.fire('stop');
            }
            var r = Math.atan2(ig.game.player.pos.y-this.pos.y, ig.game.player.pos.x-this.pos.x);
            var velx =  Math.cos(r) * this.speed;
            this.vel.x = velx;
        }
        else if (!this.firing) {
            this.fire('start');
        }
        var vely = this.speed / 4;

        if (this.pos.y <= this.highestPoint) {
            this.vel.y = vely;
        }
        else if (this.pos.y >= this.lowestPoint) {
            this.vel.y = -vely;
        }

    },

    explode: function() {
        console.log('sploding!!');
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
     //   this.parent();
    },

    setCurrentAnim: function() {
        if (this.firing) {
            if (this.currentAnim !== this.anims.firing) {
                this.currentAnim = this.anims.firing;
            }
        }
        else {
            this.currentAnim = this.anims.idle;
        }
        this.currentAnim.flip.x = this.flip;

    },

    check: function(other) {
    },


    draw: function() {
        this.parent();
    }

});

ig.global.EntityBullet = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 40, y: 40},
    offset: {x: 0, y: 0},
    gravityFactor: 0,
    active: true,
   // zIndex: 499,
  
    // Movement
    maxVel: {x: 400, y: 650},
    friction: {x: 0, y: 0},
    accelGround: 700,
    accelAir: 800,
    speed: 300,
    lowestPoint: 150,
    highestPoint: -50,

    // Anger
    flip: true,
    minProximity: 500,
    dependentsArr: [],
    
    animSheet: new ig.AnimationSheet( 'media/characters/helicopter.png', 300, 119 ),
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.lowestPoint = ig.game.player.pos.y;
        this.highestPoint = ig.game.player.pos.y - 200;
        this.pos.y -= ig.game.player.pos.y - 400;
        this.setAnimations();

    },

    setAnimations: function() {
        this.anims.idle = new ig.Animation( this.animSheet, 0.5, [0,1] );
        this.anims.firing = new ig.Animation (this.animSheet, 0.05, [1,2] );
        this.currentAnim = this.anims.idle;
        this.currentAnim.flip.x = true;
    },
    
   
    update: function() {
        this.parent();
        this.checkDirection();
        this.moveToPlayer();
        this.currentAnim.flip.x = this.flip;

    },

    checkDirection: function() {
        if (this.pos.x > ig.game.player.pos.x) {
            this.flip = false;
        }
        else {
            this.flip = true;
        }
    },

    moveToPlayer: function() {
        var proximity = this.distanceTo(ig.game.player);
        if (proximity > this.minProximity) {
            var r = Math.atan2(ig.game.player.pos.y-this.pos.y, ig.game.player.pos.x-this.pos.x);
            var velx =  Math.cos(r) * this.speed;
            this.vel.x = velx;
        }
        var vely = this.speed / 4;

        if (this.pos.y <= this.highestPoint) {
            this.vel.y = vely;
        }
        else if (this.pos.y >= this.lowestPoint) {
            this.vel.y = -vely;
        }

    },

    explode: function() {
        console.log('sploding!!');
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
     //   this.parent();
    },

    setCurrentAnim: function() {
        if (this.firing) {
            if (this.currentAnim !== this.anims.firing) {
                this.currentAnim = this.anims.firing;
            }
        }
        else {
            this.currentAnim = this.anims.idle;
        }
        this.currentAnim.flip.x = this.flip;

    },

    check: function(other) {
    },


    draw: function() {
        this.parent();
    }

});

});