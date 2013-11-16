ig.module(
	'game.entities.gui'
)
.requires(
	'impact.entity'
   // 'imapct.entity-pool'
)

.defines(function(){"use strict";

ig.global.EntityGui = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 100, y: 100},
    gravityFactor: 0,
    zIndex: 500,
    itemHoverFont: "13px Verdana",
    itemHoverColor: "#000",
    itemBgHoverColor: "#000",

    notificationFont: "15px Verdana",
    notificationFontColor: "#000",
    notificationText: null,
    notificationDuration: 5,

    dialogFont: "9px Verdana",
    dialogFontColor: "#000",
    dialogDuration: 2,
    dialogBgColor: "#fff",

    questFont: "23px Verdana",
    questFontColor: "#ff0000",
    questSummary: "",

    clockFont: "20px Courier",
    clockFontColor: "#ff0000",

    minItemUseDistance: 100,
     
	init: function(x, y, settings) {
        ig.game.gui = this;
        this.ctx = ig.game.ctx;
        this.parent(x, y, settings);
        this.notificationTimer = new ig.Timer(this.notificationDuration);
    },


    checkItemHover: function(entity) {
        if (entity.distanceTo(ig.game.player) < this.minItemUseDistance || ig.game.pointer.touches(entity)) {
            return true;
        }
        else {
            return false;
        }
    },

    drawHoverText: function(entity) {
        ig.game.ctx.fillStyle = ig.game.gui.itemHoverColor;
        ig.game.ctx.font =  ig.game.gui.itemHoverFont;
        ig.game.ctx.textBaseline = 'middle';
        ig.game.ctx.textAlign = 'center';
        ig.game.ctx.fillText(entity.hoverText, entity.pos.x + entity.size.x / 2 - ig.game.screen.x, entity.pos.y - 5 - ig.game.screen.y);
    },

    drawQuestText: function() {
        this.ctx.save();
        this.ctx.fillStyle = this.questFontColor;
        this.ctx.font = this.questFont;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText(this.questSummary, ig.system.width / 2, ig.system.height);
        this.ctx.restore();
    },

    drawClock: function(hour, minute) {
        this.ctx.save();
        this.ctx.fillStyle = this.clockFontColor;
        this.ctx.font = this.clockFont;
        this.ctx.textBaseline = "top";
        var x = ig.system.width / 2;
        var y = 5;
        this.ctx.fillText(hour + ':' + minute, x, y);

    },

    setNotificationText: function(string) {
        this.notificationTimer.reset();
        this.notificationText = string;
    },

    clicked: function() {
      
    },
 
    closeAllDependents: function(entity) {
        if (entity.dependentsArr) {
            var length = entity.dependentsArr.length;
            for (var i = 0; i < length; i++) {
            //    console.log('destroy');
                var dependentEntity = entity.dependentsArr[i];
                if (dependentEntity.dependentsArr.length > 0) {
                    this.closeAllDependents(dependentEntity);
                    dependentEntity.dependentsArr.length = 0;
                }
                dependentEntity.kill();
            }
            entity.dependentsArr.length = 0;   
        } 
    },
   
    update: function() {
        this.parent();
        if (this.notificationText !== null) {
            if (this.notificationTimer.delta() > 0) {
                this.notificationText = null;
            }
        }
       
    },
    
    draw: function() {
        this.parent();
        // Add your own drawing code here
       
        
    }

});

ig.global.EntityDialog = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 100, y: 100},
    gravityFactor: 0,
    zIndex: 500,
   
    clickable: true,

    parentEntity: null,

    dialogType: null,

    dialogFont: "9px Verdana",
    dialogFontColor: "#000",
    dialogDuration: 2,
    dialogBgColor: "#fff",

    minItemUseDistance: 100,

    dependentsArr: [],

    text: null,
     
    init: function(x, y, settings) {
        this.ctx = ig.game.ctx;
        this.parent(x, y, settings);
        this.parentEntity.dependentsArr.push(this);
        this.pos.y -= this.size.y - 5;
        this.text = ig.game.controller.splitLines(this.text,this.dialogFont, this.size.x + 50);
        if (this.dialogType === 'thanks') {
            ig.game.spawnEntity(EntityResponse, this.pos.x + this.size.x + 5, this.pos.y, {parentEntity: this, mood: 'positive'});
            ig.game.spawnEntity(EntityResponse, this.pos.x + this.size.x + 5, this.pos.y + 15, {parentEntity: this, mood: 'negative'});
            if (ig.game.player.holding instanceof EntityPaper) {
                ig.game.player.holding.kill();
                ig.game.player.holding = null;
            }
        }
        else {
            if (this.paper) {
                ig.game.spawnEntity(EntityPaper, this.pos.x, this.pos.y, {pickedUp: true})
            }
        }
    },


   

    setDialogText: function(entity, string) {
        entity.dialogTimer.reset();
        entity.dialogText = string;
    },
  
    drawDialogText: function(entity) {
        if (entity.dialogText !== null) {
            console.log('drawin');
            var x = entity.pos.x + entity.size.x + 5,
                y = entity.pos.y;
            this.ctx.save();
            this.ctx.fillRect(x, y, 100, 100);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = this.dialogFontColor;
            this.ctx.font = this.dialogFont;
            this.ctx.fillText(entity.dialogText, x, y);
            this.ctx.restore();
        }
    },

    clicked: function() {
        this.kill();
    },
 
   
    update: function() {
        this.parent();
    },

    kill: function() {
        if (this.dialogType === 'thanks') {
            ig.game.player.activeQuest++;
            console.log('active quest: ' + ig.game.player.activeQuest);
            ig.game.controller.removeFromArray(this, this.parentEntity.dependentsArr);
            this.parentEntity.active = true;
        }
        this.parent();
    },
    
    draw: function() {
     //   this.parent();
        ig.game.ctx.save();
        ig.game.ctx.fillStyle = this.dialogBgColor;
        ig.game.ctx.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
        ig.game.ctx.fillStyle = this.dialogFontColor;
        ig.game.ctx.textAlign = 'left';
        ig.game.ctx.font = this.dialogFont;
        var x = this.pos.x + 5 - ig.game.screen.x;
        var y = this.pos.y + 5 - ig.game.screen.y;
        for (var i = 0; i < this.text.length; i++) {
            ig.game.ctx.fillText(this.text[i], x, y);
            y += 10;
        }
        ig.game.ctx.restore();
    }

});

ig.global.EntityResponse = ig.Entity.extend({
    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,

   
    size: {x: 100, y: 10},
    gravityFactor: 0,
    zIndex: 500,
   
    clickable: true,

    parentEntity: null,

    dialogFont: "bold 9px Verdana",
    dialogFontColor: "#000",
    dialogDuration: 2,
    dialogBgColor: "#fff",

  //  positiveFontColor: "#0000ff",
  //  negativeFontColor: "#ff0000",
    dependentsArr: [],

    positiveOptions: ['No problem', 'You\'re welcome', 'Sure', 'Yes sir', 'No worries!', 'Any time', 'Have a great day!', 'No, thank you'],
    negativeOptions: ['Yeah, ok', 'Whatever', 'Screw you', 'You suck', 'I hate you', 'These tasks are idiotic', 'Go fuck yourself', 'I hope you die', 'This place sucks'],

    mood: null,

    minItemUseDistance: 100,

    text: null,
     
    init: function(x, y, settings) {
        this.ctx = ig.game.ctx;
        this.parent(x, y, settings);
        this.parentEntity.dependentsArr.push(this);
        if (this.mood === 'positive') {
            this.text = this.positiveOptions[ig.game.controller.randomFromTo(0,this.positiveOptions.length - 1)];
        }
        else {
            this.text = this.negativeOptions[ig.game.controller.randomFromTo(0,this.negativeOptions.length - 1)];
        }

    },  

    clicked: function() {
        if (this.mood === 'negative') {
            ig.game.player.anger += 10;
        }
        else {
            if (ig.game.player.anger > 5) {
                ig.game.player.anger -= 5;
            }
            else {
                ig.game.player.anger = 0;
            }
        }
        ig.game.gui.closeAllDependents(this.parentEntity);
    //   this.parentEntity.parentEntity.active = true;
        this.parentEntity.kill();
    },
 
   
    update: function() {
        this.parent();
    },
    
    draw: function() {
        ig.game.ctx.save();
        ig.game.ctx.fillStyle = this.dialogBgColor;
        ig.game.ctx.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
        ig.game.ctx.fillStyle = this.dialogFontColor;
        ig.game.ctx.textAlign = 'left';
        ig.game.ctx.font = this.dialogFont;

        var x = this.pos.x + 5 - ig.game.screen.x;
        var y = this.pos.y + 5 - ig.game.screen.y;
        ig.game.ctx.fillText(this.text, x, y);
        ig.game.ctx.restore();
    }

});


});