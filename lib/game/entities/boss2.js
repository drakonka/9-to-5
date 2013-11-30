ig.module(
	'game.entities.boss2'
)
.requires(
	'impact.entity'   
)

.defines(function(){"use strict";

ig.global.EntityBoss2 = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 25, y: 200},
    offset: {x: 55, y: 0},
    gravityFactor: 1,

    active: true,
    angerLevel: 15,
    dependentsArr: [],
    flip: true,

    displayHoverText: false,
    hoverText: "Ted Tronser",
    questCompletionTextArr: ['Thanks, Jim.'],
    questsArr: [{id: 2, dialogText: "Go make me a cup of coffee.", questSummary: "Bring coffee to Ted Tronser", paper: false,},
                {id: 3, dialogText: "I need you to give Rob Ranton downstairs this invoice.", questSummary: "See Ron Ranton", paper: true},
                {id: 5, dialogText: "Alright, go give that bastard this new invoice.", questSummary: "See Ron Ranton", paper: true},
                {id: 11, dialogText: "You should go home now. See you bright and early!", questSummary: "Go home and sleep", paper: false}],
    
    
    tedSound1: new ig.Sound( 'media/audio/ted1.*' ),
    tedSound2: new ig.Sound( 'media/audio/ted2.*' ),

    humanAnimSheet: new ig.AnimationSheet( 'media/characters/boss2.png', 143, 225 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.tedSoundsArr = [this.tedSound1, this.tedSound2];
        this.setHumanAnimations();
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
            if (ig.game.currentLevel === LevelGameover) {
                var line = "Well, Jim...let's not let that happen again. The Company has decided to get you some therapy. Because we care. So...see you tomorrow?";
                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: line, dialogType: 'thanks'});

            }
        }
    },

    setHumanAnimations: function() {
        this.anims.idle = new ig.Animation( this.humanAnimSheet, 0.5, [16,17] );
        this.anims.walking = new ig.Animation (this.humanAnimSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] );
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
        ig.game.spawnEntity(EntityExplosion, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {parentEntity: this});
        if (this.holding) {
            this.holding.kill();
        }
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
                if (other.dressed) {
                    switch (other.activeQuest) {
                        case 1:
                            ig.game.gui.closeAllDependents(this);
                            this.active = false;
                            var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                            var questCompletionLine = this.questCompletionTextArr[rand];
                            var rand = ig.game.controller.randomFromTo(0, this.tedSoundsArr.length - 1);
                            var soundToPlay = this.tedSoundsArr[rand];
                            soundToPlay.play();
                            ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                            break;
                        case 2:
                            if (other.holding && other.holding instanceof EntityCoffeecup) {
                                ig.game.gui.closeAllDependents(this);
                                this.active = false;

                                var rand = ig.game.controller.randomFromTo(0,this.questCompletionTextArr.length - 1);
                                var questCompletionLine = this.questCompletionTextArr[rand];
                                var rand = ig.game.controller.randomFromTo(0, this.tedSoundsArr.length - 1);
                                var soundToPlay = this.tedSoundsArr[rand];
                                soundToPlay.play();
                                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                                other.holding.clickable = false;
                                other.holding.pos.x = this.pos.x;
                                other.holding.pos.y = this.pos.y + this.size.y / 2;
                                this.holding = other.holding;
                                other.holding = null;
                            }
                            break;
                        case 4:
                            ig.game.gui.closeAllDependents(this);
                            this.active = false;
                            var questCompletionLine = 'What?! Wrong one? That fucker. Oh fine, thanks Jim.';
                            var rand = ig.game.controller.randomFromTo(0, this.tedSoundsArr.length - 1);
                            var soundToPlay = this.tedSoundsArr[rand];
                            soundToPlay.play();
                            ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                            break;
                        case 10:
                            if (!other.holding) {
                                ig.game.gui.closeAllDependents(this);
                                this.active = false;
                                var questCompletionLine;
                                if (ig.game.player.lateDelivery) {
                                    questCompletionLine = "You delivered these too late, Jim. Thanks for nothin'"
                                }
                                else {
                                    questCompletionLine = "Thanks for delivering those cheques."
                                }
                                var rand = ig.game.controller.randomFromTo(0, this.tedSoundsArr.length - 1);
                                var soundToPlay = this.tedSoundsArr[rand];
                                soundToPlay.play();
                                ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
                            }
                            break;
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
                        if (ig.game.clockHour > 17 + other.coffeeDrunk || ig.game.clockHour === 17 && ig.game.clockMinute > 0) {
                            activeQuest.dialogText = "You look like a zombie. Wake up. " + activeQuest.dialogText;
                        }


                        if (activeQuest) {
                            ig.game.gui.questSummary = activeQuest.questSummary;
                            ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: activeQuest.dialogText, questNum: other.activeQuest, paper: activeQuest.paper});
                        }
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