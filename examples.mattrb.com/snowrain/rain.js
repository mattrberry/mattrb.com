var rain = function() {
    var c = document.getElementById("snowrain");
    var ctx = c.getContext("2d");

    var width = c.width;
    var height = c.height;

    var raindrops = [];
    var pool = -10;

    var chanceOfRain = 0.0005;

    var wind = 0.001;
    
    var gravity = 0.1;

    var waveLength = 100;

    var tick = 0;
    
    function Rain (x) {
	this.x = x;
	this.y = 0;
	this.oldX = this.x;
	this.oldY = this.y;
	this.dx = wind;
	this.dy = 5;
	this.updateRain = function() {
	    this.oldX = this.x;
	    this.oldY = this.y;
	    this.x += this.dx;
	    this.y += this.dy;
	    this.dx += this.dy * wind;
	    this.dy += gravity;
	}
    }
	    
    function draw() {
	if (!screenFilled()) {
	    requestAnimationFrame(draw);
	} else {
	    console.log("Rain took " + ((new Date().getTime() - startTime) / 1000) + " to fill the screen.");
	    snow();
	}

	drawBackground();

	updateRain();
	spawnRain();
	removeRain();
	drawRain();

	drawPool();

	tick++;
    }

    function drawRain() {
	for (var i = 0; i < raindrops.length; i++) {
	    ctx.beginPath();
	    ctx.moveTo(raindrops[i].oldX, raindrops[i].oldY);
	    ctx.lineTo(raindrops[i].x, raindrops[i].y);
	    ctx.lineWidth = 4;
	    ctx.strokeStyle = "#290f5a";

	    ctx.stroke();
	}
    }

    function drawBackground() {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);
    }

    function spawnRain() {
	for (var i = 0; i <= width; i++) {
	    if (Math.random() < chanceOfRain) {
		raindrops.push(new Rain(i));
	    }
	}
    }

    function updateRain() {
	for (var i = 0; i < raindrops.length; i++) {
	    raindrops[i].updateRain();
	}
    }

    function removeRain() {
	for (var i = raindrops.length - 1; i >= 0; i--) {
	    if (raindrops[i].y > height - pool) {
		pool += .01 * 10;
		raindrops.splice(i, 1);
	    }
	}
    }

    function drawPool() {
	var x = -tick/50 % width;
	var y = height - pool;

	ctx.beginPath();
	ctx.moveTo(x,y);
	for (var i = x; i <= width + waveLength; i += waveLength) {
	    x = i;
	    y = height - pool - Math.sin(x) * 8;
	    ctx.lineTo(x, y);
	}
	ctx.lineTo(width+50, height + 50);
	ctx.lineTo(-tick/5 % width, height + 50);
	ctx.closePath();

	ctx.lineWidth = 5;
	ctx.fillStyle = "#290f5a";
	ctx.fill();
	ctx.strokeStyle = "#290f5a";
	ctx.stroke();
    }
    
    function screenFilled() {
	return (pool - 8 >= 1000);
    }

    var startTime = new Date().getTime();
    draw();
}
