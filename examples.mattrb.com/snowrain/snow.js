var snow = function() {
    var c = document.getElementById("snowrain");
    var ctx = c.getContext("2d");

    var width = c.width;
    var height = c.height;

    var snowflakes = [];
    var pile = [];
    for (var i = 0; i < width; i++) {
	pile.push(0);
    }

    var chanceOfSnow = 0.0005;

    var driftCluster = 4;
    
    var fallSpeed = 0.5;
    var fallCluster = 4;

    function Snow (x,r) {
	this.x = x;
	this.y = 0;
	this.dx = 0;
	this.dy = 1;
	this.tx = Math.floor(Math.random() * 100);
	this.ty = Math.floor(Math.random() * 100);
	this.radius = r;
	this.updateSnow = function() {
	    this.tx += .01 * Math.random(); 
	    this.ty += .01 * Math.random(); 
	    this.dx = Math.sin(this.tx)/driftCluster;
	    this.dy = fallSpeed + Math.sin(this.ty)/fallCluster;
	    this.x += this.dx;
	    this.y += this.dy;
	}
    }

    function draw() {
	if (!screenFilled()) {
	    requestAnimationFrame(draw);
	} else {
	    console.log("Snow took " + ((new Date().getTime() - startTime) / 1000) + " to fill the screen.")
	    rain();
	}

	drawBackground();
	
	updateSnow();
	spawnSnow();
	removeSnow();
	drawSnow();

	smoothPile();
	drawPile();
    }

    function drawSnow() {
	for (var i = 0; i < snowflakes.length; i++) {
	    ctx.beginPath();
	    ctx.arc(snowflakes[i].x, snowflakes[i].y, snowflakes[i].radius, 0, 2*Math.PI);
	    ctx.fillStyle = "#fff";
	    ctx.fill();
	}
    }

    function drawBackground() {
	ctx.fillStyle = "#290f5a";
	ctx.fillRect(0, 0, width, height);
    }
    
    function spawnSnow() {
	for (var i = 0; i <= width; i++) {
	    if (Math.random() < chanceOfSnow) {
		snowflakes.push(new Snow(i, Math.floor(Math.random() * 2 + 2)));
	    }
	}
    }

    function updateSnow() {
	for (var i = 0; i < snowflakes.length; i++) {
	    snowflakes[i].updateSnow();
	}
    }

    function removeSnow() {
	for (var i = snowflakes.length - 1; i >= 0; i--) {
	    x = Math.floor(snowflakes[i].x);
	    if (snowflakes[i].y > height || snowflakes[i].y > height - pile[x]) {
		if (x >= 0 && x < width) {
		    if (pile[x] != height) {
			pile[x] += 1;
		    }
		}
		snowflakes.splice(i, 1);
	    }
	}
    }

    function smoothPile() {
	for (var i = pile.length - 2; i >= Math.floor(pile.length/2); i--) {
	    pile[i] = Math.ceil((pile[i-1] + pile[i+1]) / 2);
	}
	for (var i = 1; i < Math.floor(pile.length/2); i++) {
	    pile[i] = Math.ceil((pile[i-1] + pile[i+1]) / 2);
	}
	pile[0] = pile[1];
	pile[pile.length-1] = pile[pile.length-2];
    }
	    
    function drawPile() {
	for (var i = 0; i < pile.length; i++) {
	    ctx.beginPath();
	    ctx.moveTo(i, height - pile[i]);
	    ctx.lineTo(i, height);
	    ctx.strokeStyle = "#fff";
	    ctx.lineWidth = 2;
	    ctx.stroke();
	}
    }

    function screenFilled() {
	for (var i = 0; i < pile.length; i++) {
	    if (pile[i] < 1000) {
		return false;
	    }
	}
	return true;
    }

    var startTime = new Date().getTime();
    draw();
}
