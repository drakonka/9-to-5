ig.module(
	'game.entities.boss1'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityBoss1 = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 45, y: 200},
    offset: {x: 65, y: 0},
    gravityFactor: 1,
    steppingUp: false,
    active: true,
   // zIndex: 499,
  
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

    dependentsArr: [],

    displayHoverText: false,
    hoverText: "Bill Brawnser",
    questCompletionTextArr: ['Thanks, Jim.'],

    questsArr: [{id: 1, dialogText: "Go give Ted Tronser upstairs this piece of paper, would ya?", questSummary: "See Ted Tronser", paper: true},
                {id: 7, dialogText: "Go staple this for me and bring it back, would ya?", questSummary: "Staple invoice for Bill Bronser", paper: true},
                {id: 8, dialogText: "Now go give this back to Rob Ranton, would ya?", questSummary: "See Rob Ranton", paper: true}],

//    dialogTimer: new ig.Timer(3),

    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/boss1.png', 143, 225 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setHumanAnimations();

    },

    setHumanAnimations: function() {
        this.anims.idle = new ig.Animation( this.humanAnimSheet, 0.5, [16,17] );
        this.anims.walking = new ig.Animation (this.humanAnimSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] );
        this.currentAnim = this.anims.idle;
        this.currentAnim.flip.x = true;
    },
	
   
    update: function() {
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);
        if (ig.game.player.isWerewolf && this.active && this.distanceTo(ig.game.player) <= 100) {
            this.active = false;
            this.explode();
        }


    },

    explode: function() {
        console.log('sploding!!');
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
     //   this.parent();
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
            if (!other.isWerewolf) {
                switch (other.activeQuest) {
                    case 6:
                        ig.game.gui.closeAllDependents(this);
                        this.active = false;
                        var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                        var questCompletionLine = this.questCompletionTextArr[rand];
                        ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                        break;
                    case 7:
                        if (other.holding && other.holding.stapled) {
                            console.log('stapled so wtf');
                            ig.game.gui.closeAllDependents(this);
                            this.active = false;
                            var questCompletionLine = "Great stapling skills, Jim";
                            ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                        }
                        break;
                    default: 
                        break;
                }
        
                var activeQuest = ig.game.controller.checkActiveQuest(this, other);
                if (other.activeQuest === 1) {
                    if (ig.game.clockHour > 9 || ig.game.clockHour === 9 && ig.game.clockMinute >= 5) {
                        activeQuest.dialogText = "You're late again, Jim. " + activeQuest.dialogText;
                    }
                    else {
                        activeQuest.dialogText = "Mornin', Jim. " + activeQuest.dialogText;
                    }
                }
        
                if (this.dependentsArr.length === 0) {
                    if (activeQuest) {
                        console.log('this should not be happening2 ' + this.active)
                        ig.game.gui.questSummary = activeQuest.questSummary;
                        ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: activeQuest.dialogText, questNum: other.activeQuest, paper: activeQuest.paper});
                    }
                }
            }
            else {
                this.active = false;
                this.explode();
            }

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