var width = window.innerWidth,
	height = window.innerHeight;

engine.init();

var screen = new Screen([width, height]);

var player = new Object();
player.polygons = objects.arc(10);
player.size = new Vector(100, 100);
player.position = new Vector(width / 2, height / 2);

function draw(){
	screen.fill("#ffffff");

	screen.drawGO(player);
}

setInterval(draw, engine.math.fps("max"));