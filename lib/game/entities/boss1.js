ig.module(
	'game.entities.boss1'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityBoss1 = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 25, y: 200},
    offset: {x: 55, y: 0},
    gravityFactor: 1,
    steppingUp: false,
    active: true,
    angerLevel: 15,

    flip: true,

    dependentsArr: [],

    displayHoverText: false,
    hoverText: "Bill Brawnser",
    questCompletionTextArr: ['Thanks, Jim.'],

    questsArr: [{id: 1, dialogText: "Go give Ted Tronser upstairs this piece of paper, would ya?", questSummary: "See Ted Tronser", paper: true},
                {id: 7, dialogText: "Go staple this for me and bring it back, would ya?", questSummary: "Staple invoice for Bill Brawnser", paper: true},
                {id: 8, dialogText: "Now go give this back to Rob Ranton, would ya?", questSummary: "See Rob Ranton", paper: true}],


    billSound1: new ig.Sound( 'media/audio/bill1.*' ),
    billSound2: new ig.Sound( 'media/audio/bill2.*' ),

    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/boss1.png', 143, 225 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.billSoundsArr = [this.billSound1, this.billSound2];
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
        }
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
            ig.game.player.attackSound.play();
            this.explode();
        }


    },

    explode: function() {
        ig.game.gui.closeAllDependents(this);
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
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
        if (this.active && other instanceof EntityPlayer || other instanceof EntityPlayer && other.isWerewolf) {
            if (!other.isWerewolf) {
                switch (other.activeQuest) {
                    case 1:
                        if (other.sentHome && other.dressed) {
                            other.sentHome = false;
                            ig.game.gui.closeAllDependents(this);
                        }
                        break;
                    case 6:
                        ig.game.gui.closeAllDependents(this);
                        this.active = false;
                        var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                        var questCompletionLine = this.questCompletionTextArr[rand];
                        var rand = ig.game.controller.randomFromTo(0, this.billSoundsArr.length - 1);
                        var soundToPlay = this.billSoundsArr[rand];
                        soundToPlay.play();
                        ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                        break;
                    case 7:
                        if (other.holding && other.holding.stapled) {
                            ig.game.gui.closeAllDependents(this);
                            this.active = false;
                            var questCompletionLine = "Great stapling skills, Jim";
                            var rand = ig.game.controller.randomFromTo(0, this.billSoundsArr.length - 1);
                            var soundToPlay = this.billSoundsArr[rand];
                            soundToPlay.play();
                            ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                        }
                        break;
                    default: 
                        break;
                }
        

                var activeQuest = ig.game.controller.checkActiveQuest(this, other);
                var questText = null;
                var spawnPaper = false;
        
                if (this.dependentsArr.length === 0) {
                    if (activeQuest) {
                        if (activeQuest.id === 1) {
                            if (ig.game.controller.dressed) {
                                var clothesLine = "Are those...yesterday's clothes? "
                            }
                            else {
                                var clothesLine = "";
                            }
                            if (!other.dressed) {
                                questText = "Whoa Jimbo! Why are you naked? Go home and put some clothes on! Ain't nobody wanna see that.";
                                ig.game.gui.questSummary = "Go home and dress, then return to Bill Brawnser.";
                                other.sentHome = true;
                            }
                            else if (ig.game.clockHour > 9 || ig.game.clockHour === 9 && ig.game.clockMinute >= 5) {
                                activeQuest.dialogText = "You're late again, Jim. " + clothesLine + activeQuest.dialogText;
                                questText = activeQuest.dialogText;
                                ig.game.gui.questSummary = activeQuest.questSummary;
                            }
                            else {
                                activeQuest.dialogText = "Mornin', Jim. " + clothesLine + activeQuest.dialogText;
                                questText = activeQuest.dialogText;
                                ig.game.gui.questSummary = activeQuest.questSummary;
                            }
                            var rand = ig.game.controller.randomFromTo(0, this.billSoundsArr.length - 1);
                            var soundToPlay = this.billSoundsArr[rand];
                            soundToPlay.play();
                        }
                        else {
                            if (ig.game.clockHour > 17 + other.coffeeDrunk) {
                                activeQuest.dialogText = "You look tired. " + activeQuest.dialogText;
                            }
                            questText = activeQuest.dialogText;
                            ig.game.gui.questSummary = activeQuest.questSummary;
                        }
                        if (activeQuest.paper && !other.sentHome) {
                            spawnPaper = true;
                        }

                        ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questText, questNum: other.activeQuest, paper: spawnPaper});
                    }
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
        if (this.displayHoverText && this.active) {
            ig.game.gui.drawHoverText(this);
        }
    }

});

});