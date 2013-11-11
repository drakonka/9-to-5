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
    offset: {x: 20, y: 0},
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

    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/player.png', 100, 200 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setHumanAnimations();

    },

    setHumanAnimations: function() {
        this.anims.idle = new ig.Animation( this.humanAnimSheet, 0.1, [0] );
        this.anims.walking = new ig.Animation (this.humanAnimSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] );
        this.currentAnim = this.anims.idle;
        this.currentAnim.flip.x = true;
    },
	
   
    update: function() {
      //  this.setCurrentAnim();
   //     ig.game.controller.killOffScreen(this, true);
        this.parent();
        this.displayHoverText = ig.game.gui.checkItemHover(this);

    /*    if (this.dialogText !== null) {
            if (this.dialogTimer.delta() > 0) {
                this.dialogText = null;
            }
        } */
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
            if (other.activeQuest === 6) {
                ig.game.gui.closeAllDependents(this);
                this.active = false;
                var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                var questCompletionLine = this.questCompletionTextArr[rand];
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
            }
            else if (other.activeQuest === 7) {
                if (other.holding && other.holding.stapled) {
                    ig.game.gui.closeAllDependents(this);
                    this.active = false;
                    var questCompletionLine = "Great stapling skills, Jim";
                    ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                }
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
    
            if (this.dependentsArr.length === 0 || other.activeQuest !== this.dependentsArr[0].questNum) {
                if (activeQuest) {
                    ig.game.gui.questSummary = activeQuest.questSummary;
                    ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: activeQuest.dialogText, questNum: other.activeQuest, paper: activeQuest.paper});
                }
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