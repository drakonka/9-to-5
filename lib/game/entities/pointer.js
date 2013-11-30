ig.module(
	'game.entities.pointer'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityPointer = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.B,
    size: {x:1, y:1},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
        ig.game.pointer = this;
	},
	
    update: function() {
        this.pos.x = ig.input.mouse.x + ig.game.screen.x;
        this.pos.y = ig.input.mouse.y + ig.game.screen.y;
    },

    check: function( other ) {

        if (ig.input.released('click') && other.clickable ) {
            if (other instanceof EntityButton || ig.game.player.distanceTo(other) <= other.minItemUseDistance || other instanceof EntityDialog || other instanceof EntityResponse) {
                other.clicked();
                if (other.sound) {
                    other.sound.play();
                }
            }
            else {
                ig.game.gui.setNotificationText("You're not close enough to do that.");
            }
        }
    }

});
});