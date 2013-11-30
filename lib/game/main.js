ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.player',
	'game.entities.pointer',
	'game.entities.gui',

	'game.entities.passerby',
	'game.entities.boss1',
	'game.entities.boss2',
	'game.entities.boss3',

	'game.entities.explosion',
	'game.entities.helicopter',

	'game.entities.banana',
	'game.entities.bananapeel',
	'game.entities.alarmclock',
	'game.entities.slippers',
	'game.entities.puddle',
	'game.entities.toothbrush',
	'game.entities.trashcan',
	'game.entities.coffeemachine',
	'game.entities.coffeecup',
	'game.entities.fishbowl',
	'game.entities.elevator',
	'game.entities.paper',
	'game.entities.stapler',
	'game.entities.invoiceholder',
	'game.entities.clotheshanger',
	'game.entities.wall',

	'game.levels.menu',
	'game.levels.main',
	'game.levels.gameover',

	'game.misc.controller',

	'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	currentLevel: null,
	gravity: 1000,
	steppableEntitiesArr: [],
	controller: new ig.Controller(),

	clockTimer: new ig.Timer(0.5),
	normalTime: 0.5,
	officeTime: 0.3,
	clockHour: 7,
	clockMinute: 0,
	difficulty: 1,
	blackoutAlpha: 0,
	screamSound: new ig.Sound( 'media/audio/scream.*', false ),
	alarmSong: new ig.Sound( 'media/audio/alarmmusic.*', false ),
	themeSong: new ig.Sound( 'media/audio/themesong.*', false ),
	bgMusic: new ig.Sound( 'media/audio/backgroundmusic.*', false),


	passerbyTimer: new ig.Timer(3),

	init: function() {
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.SPACE, 'space' );
		ig.input.bind( ig.KEY.ESC, 'esc' );

		ig.music.add( this.alarmSong, 'alarmmusic');
		ig.music.add( this.themeSong, 'themesong' );
		ig.music.add( this.bgMusic, 'bgmusic' );
		this.ctx = ig.system.context;
		this.loadLevel(LevelMenu);
	},

	loadLevel: function(data) {
		this.currentLevel = data;
		if (data === LevelGameover) {
			if (this.getEntitiesByType(EntityHelicopter)[0]) {
    			this.getEntitiesByType(EntityHelicopter)[0].sound.stop();
			}
		}
		this.parent( data );
		this.spawnEntity(EntityGui, 0, 0);
		this.spawnEntity(EntityPointer, 0, 0);
		switch(this.currentLevel) {
			case LevelMenu:
            	ig.music.play('themesong');
            	ig.music.loop = true;
				this.clockHour = 7;
				this.clockMinute = 0;
				this.spawnEntity(EntityButton, ig.system.width / 2 - 78,ig.system.height /2 , {kind: 'play'});
				break;
			case LevelMain:
				this.clockHour = 7;
				this.clockMinute = 0;
				this._mapWidth = this.backgroundMaps[0].width * this.backgroundMaps[0].tilesize - (ig.system.width);
				this._mapHeight = this.backgroundMaps[0].height * this.backgroundMaps[0].tilesize - (ig.system.height);
				break;
			case LevelGameover:
				this.controller.fishDead = false;
				this.controller.fishFed = false;
				this.controller.dressed = false;
				ig.music.volume = 1;
            	ig.music.play('themesong');
				break;
		}
	},

	update: function() {
		this.parent();
		this.scrollScreen();
		if (this.currentLevel === LevelMain) {
			if (this.clockTimer && this.clockTimer.delta() > 0) {
				this.clockTimer.reset();
				this.clockMinute++;
				if (this.clockMinute > 60) {
					this.clockMinute = 0;
					this.clockHour++;

				}

				if (this.clockHour > 24) {
					this.clockHour = 1;
				}
			}
			if (ig.game.player.location === 'outside') {
				if (this.passerbyTimer.delta() > 0) {
					this.passerbyTimer.reset();
		            var rand = this.controller.randomFromTo(0,1);
		            var x;
		            if (rand === 0) {
		                x = 3741;
		            }
		            else {
		                x = 2000;
		            }
		            this.spawnEntity(EntityPasserby, x, this.player.pos.y);
				}
			}
		}
	},

	loadNextDay: function() {
		ig.game.controller.day++;
        if (!ig.game.controller.fishFed) {
            this.controller.fishDied = true;
        }
        if (this.player.dressed) {
        	this.controller.dressed = true;
        }
        else {
        	this.controller.dressed = false;
        }
        ig.game.loadLevel(LevelMain);
    },


	scrollScreen: function() {
		if (this.player) {
			var x = this.player.pos.x - (ig.system.width / 2);
			var y = this.player.pos.y  - ig.system.height + 240;
			this.screen.x = (x > 0 && x < this._mapWidth) ? x : this.screen.x;
			this.screen.y = y;
		}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		if (this.currentLevel === LevelMain) {
			if (this.gui.notificationText !== null) {
	            var x = ig.system.width / 2,
					y = this.player.pos.y - 25 - this.screen.y;
	            this.ctx.save();
	            this.ctx.textAlign = 'center';
	            this.ctx.fillStyle = this.gui.notificationFontColor;
	            this.ctx.font = this.gui.notificationFont;
	            this.ctx.fillText(this.gui.notificationText, x, y);
	            this.ctx.restore();
	        }
	        this.gui.drawQuestText();
	        this.gui.drawClock(this.clockHour, this.clockMinute);

	        // Draw anger meter
	        var grd = this.ctx.createRadialGradient(ig.system.width / 2, ig.system.height / 2, 100, ig.system.width / 2, ig.system.height / 2, ig.system.height);
			grd.addColorStop(0, "rgba(255,255,255,0");
			grd.addColorStop(1, "rgba(255,0,0," + this.player.anger/100);

			this.ctx.fillStyle = grd;
			this.ctx.fillRect(0, 0, ig.system.width, ig.system.height);
			if (ig.game.player.sleeping && ig.game.player.activeQuest === 11) {
	            if (this.blackoutAlpha >= 0.95) {
	                this.loadNextDay();
	            }
	            ig.game.ctx.fillStyle = "rgba(0,0,0," + this.blackoutAlpha + ")";
	            ig.game.ctx.fillRect(0, 0, ig.system.width, ig.system.height);
	            this.blackoutAlpha += 0.01;
        	}

		}
	}
});


ig.main( '#canvas', MyGame, 60, 800, 400, 1 );

});
