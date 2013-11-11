ig.module(
	'game.entities.boss2'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityBoss2 = ig.Entity.extend({
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

    dependentsArr: [],

    // Anger
    flip: true,

    displayHoverText: false,
    hoverText: "Ted Tronser",
    questCompletionTextArr: ['Thanks, Jim.'],
    questsArr: [{id: 2, dialogText: "Go make me a cup of coffee.", questSummary: "Bring coffee to Ted Tronser", paper: false,},
                {id: 3, dialogText: "I need you to give Rob Ranton downstairs this invoice.", questSummary: "See Ron Ranton", paper: true},
                {id: 5, dialogText: "Alright, go give that bastard this new invoice.", questSummary: "See Ron Ranton", paper: true}],



 //   questsArr: [{id: 2, dialogText: "Alright, thanks Jim.", questSummary: "See Ted Tronser"}],

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

/*    clicked: function() {

    } */

    check: function(other) {
        if (this.active && other instanceof EntityPlayer) {
            if (other.activeQuest === 1) {
                ig.game.gui.closeAllDependents(this);
                this.active = false;

                console.log('wat');
                var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                var questCompletionLine = this.questCompletionTextArr[rand];
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
            }
            else if (other.activeQuest === 2 && other.holding && other.holding instanceof EntityCoffeecup) {
                ig.game.gui.closeAllDependents(this);
                this.active = false;

                var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                var questCompletionLine = this.questCompletionTextArr[rand];
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
            //    other.holding.kill();
                other.holding.clickable = false;
                other.holding.pos.x = this.pos.x;
                other.holding.pos.y = this.pos.y + this.size.y / 2 - 15;
                other.holding = null;
            }
            else if (other.activeQuest === 4) {
                ig.game.gui.closeAllDependents(this);
                this.active = false;
                var questCompletionLine = 'What?! Wrong one? That fucker. Oh fine, thanks Jim.';
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
            }

            else if (other.activeQuest === 10 && !other.holding) {
                ig.game.gui.closeAllDependents(this);
                this.active = false;
                var questCompletionLine;
                if (ig.game.player.lateDelivery) {
                    questCompletionLine = "You delivered these too late, Jim. Thanks for nothin'"
                }
                else {
                    questCompletionLine = "Thanks for delivering those cheques."
                }
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
            }

            if (this.dependentsArr.length === 0) {
                var activeQuest = ig.game.controller.checkActiveQuest(this, other);

                if (other.activeQuest === 2) {
                    if (!other.brushedTeeth) {
                        activeQuest.dialogText = "Your breath stinks, Jim. " + activeQuest.dialogText;
                    }
                    else {
                        activeQuest.dialogText = "Mornin', Jim. " + activeQuest.dialogText;
                    }
                }

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