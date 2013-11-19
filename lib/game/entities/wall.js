ig.module(
	'game.entities.wall'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityWall = ig.Entity.extend({
    collides: ig.Entity.COLLIDES.FIXED,
    size: {x:1, y:1},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
    update: function() {
    },

    draw: function() {
        ig.game.ctx.fillStyle = "#ccc";
        ig.game.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

});
});