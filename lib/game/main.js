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

	'game.levels.main',

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
	clockHour: 7,
	clockMinute: 0,

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.UP_ARROW, 'jump');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.SPACE, 'space' );
		ig.input.bind( ig.KEY.ESC, 'esc' );

		this.ctx = ig.system.context;
		this.loadLevel(LevelMain);
	},

	loadLevel: function(data) {
		this.currentLevel = data;
		this.parent( data );
		this.spawnEntity(EntityPointer, 0, 0);
		this.spawnEntity(EntityGui, 0, 0);
		this._mapWidth = ig.game.backgroundMaps[0].width * ig.game.backgroundMaps[0].tilesize - (ig.system.width);
		this._mapHeight = ig.game.backgroundMaps[0].height * ig.game.backgroundMaps[0].tilesize - (ig.system.height);
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		this.scrollScreen();
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

		/*	if (this.clockMinute % 60 === 0) {
				this.clockHour++;
			} */
		}
	},

	scrollScreen: function() {
		if (ig.game.player) {
			var x = ig.game.player.pos.x - (ig.system.width / 2);
			var y = ig.game.player.pos.y  - ig.system.height + 240;
			this.screen.x = (x > 0 && x < this._mapWidth) ? x : this.screen.x;
			this.screen.y = y;
		}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		if (ig.game.gui.notificationText !== null) {
            var x = ig.system.width / 2,
				y = this.player.pos.y - 25 - ig.game.screen.y;
            this.ctx.save();
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = ig.game.gui.notificationFontColor;
            this.ctx.font = ig.game.gui.notificationFont;
            this.ctx.fillText(ig.game.gui.notificationText, x, y);
            this.ctx.restore();
        }
        ig.game.gui.drawQuestText();
        ig.game.gui.drawClock(this.clockHour, this.clockMinute);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800, 400, 1 );

});
