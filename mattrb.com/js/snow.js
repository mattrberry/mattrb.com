var snow = function() {
    var c = document.getElementById("snow");
    var ctx = c.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    var width = c.width;
    var height = c.height;

    var snowflakes = [];
    var pile = [];
    for (var i = 0; i < width; i++) {
	pile.push(0);
    }

    var chanceOfSnow = 0.00005;

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
	requestAnimationFrame(draw);

        if (window.innerWidth != ctx.canvas.width || window.innerHeight != ctx.canvas.height) {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            width = window.innerWidth;
            height = window.innerHeight;
        }
        
	drawBackground();
	
	updateSnow();
	spawnSnow();
	removeSnow();
	drawSnow();
    }

    function drawSnow() {
	for (var i = 0; i < snowflakes.length; i++) {
	    ctx.beginPath();
	    ctx.arc(snowflakes[i].x, snowflakes[i].y, snowflakes[i].radius, 0, 2*Math.PI);
	    ctx.fillStyle = "#ecf0f1";
	    ctx.fill();
	}
    }

    function drawBackground() {
	ctx.fillStyle = "#34495e";
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
	    if (snowflakes[i].y > height) {
		snowflakes.splice(i, 1);
	    }
	}
    }

    draw();
}
