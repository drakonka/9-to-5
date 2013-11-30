ig.module(
	'game.entities.boss3'
)
.requires(
	'impact.entity'
)

.defines(function(){"use strict";

ig.global.EntityBoss3 = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

   
    size: {x: 25, y: 200},
    offset: {x: 55, y: 0},
    gravityFactor: 1,
    steppingUp: false,
    active: true,
    angerLevel: 15,

    dependentsArr: [],

    flip: true,

    displayHoverText: false,
    hoverText: "Rob Ranton",
    questCompletionTextArr: ['Thanks, Jim.'],
    questsArr: [{id: 4, dialogText: "This isn't the right invoice. Go get a new one from Tronser.", questSummary: "See Ted Tronser", paper: false},
                {id: 6, dialogText: "Now go get Bill to stamp this for me Jimmy.", questSummary: "See Bill Brawnser", paper: true},
                {id: 9, dialogText: "Now there, Jimmy. What did I tell you about proper stapling technique? Go do it right.", questSummary: "Re-staple papers for Rob Ranton", paper: true},
                {id: 10, dialogText: "Now, you gotta go put these cheques on Ted Tronser's desk", questSummary: "Put cheques on Ted Tronser's desk", paper: true}],

    robSound1: new ig.Sound( 'media/audio/rob1.*' ),
    robSound2: new ig.Sound( 'media/audio/rob2.*' ),
    
    humanAnimSheet: new ig.AnimationSheet( 'media/characters/boss3.png', 143, 225 ),
	init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.robSoundsArr = [this.robSound1, this.robSound2];
        if (!ig.global.wm) {
            this.minItemUseDistance = ig.game.gui.minItemUseDistance;
        }
        this.setHumanAnimations();

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
	        		case 3:
						ig.game.gui.closeAllDependents(this);
						this.active = false;
						var questCompletionLine = "An invoice from Tronster, eh? Thanks, Jimmy-Jim."
                        var rand = ig.game.controller.randomFromTo(0, this.robSoundsArr.length - 1);
                        var soundToPlay = this.robSoundsArr[rand];
                        soundToPlay.play();
						ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
	        			break;
	        		case 5:
						ig.game.gui.closeAllDependents(this);
						this.active = false;
						var questCompletionLine = "That's better. Thanks, Jimster."
                        var rand = ig.game.controller.randomFromTo(0, this.robSoundsArr.length - 1);
                        var soundToPlay = this.robSoundsArr[rand];
                        soundToPlay.play();
						ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
						break;
					case 8:
						ig.game.gui.closeAllDependents(this);
						this.active = false;
						var questCompletionLine = "All stampadoodled, I see. Thanks, Jimmy."
                        var rand = ig.game.controller.randomFromTo(0, this.robSoundsArr.length - 1);
                        var soundToPlay = this.robSoundsArr[rand];
                        soundToPlay.play();
						ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
						break;
					case 9:
						if (other.holding && other.holding.stapled) {
							ig.game.gui.closeAllDependents(this);
							this.active = false;
							var questCompletionLine = "Thaaaaaat's better, Jimmy-boy. Thanks for that."
                            if (ig.game.controller.day > 1 && ig.game.controller.isOdd(ig.game.controller.day)) {
                                questCompletionLine = questCompletionLine + " By the way, you've been doing good work here, Jimmy. Congratulatios, the Company's decided to promote you!";
                            }
                            var rand = ig.game.controller.randomFromTo(0, this.robSoundsArr.length - 1);
                            var soundToPlay = this.robSoundsArr[rand];
                            soundToPlay.play();
							ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questCompletionLine, dialogType: 'thanks'});
						}
						break;
				}
    
            
	            if (this.dependentsArr.length === 0) {
	                var activeQuest = ig.game.controller.checkActiveQuest(this, other);
                    var questText = null;
	                if (activeQuest) {
	                	if (activeQuest.id === 10) {
	                		var targetHour = ig.game.clockHour;
	                		if (ig.game.clockMinute < 30) {
	                			targetHour++;
	                		}
	                		else {
	                			targetHour += 2;
	                		}
	                		activeQuest.dialogText = activeQuest.dialogText + " by " + targetHour + " o'clock.";
	                	}

                        if (ig.game.clockHour > 17 + other.coffeeDrunk) {
                            activeQuest.dialogText = "You look like crap. Drink more coffee next time, Jimbo. " + activeQuest.dialogText;
                        }

                        questText = activeQuest.dialogText;
                        ig.game.gui.questSummary = activeQuest.questSummary;
	                    ig.game.spawnEntity(EntityDialog, this.pos.x + 5, this.pos.y, {parentEntity: this, text: questText, questNum: other.activeQuest, paper: activeQuest.paper, targetHour: targetHour});
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