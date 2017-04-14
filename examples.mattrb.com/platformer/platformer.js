// Initilization
function initialize() {
    c = document.getElementById("platformer");
    ctx = c.getContext("2d");
    main();
}


// Key Listeners
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);


// Global Variables
var c, ctx;

var HEIGHT = WIDTH = 500;

var CAMERA_FOLLOW = true;

var left = up = right = 0;
var dir = 0;
var speed = 5;
var yVel = 0;
var gravity = .5;
var terminalVel = 20;
var jumpPower = 10;

var player = {x:25, y:75, w:25, h:25};
var walls = [{x:25, y:25, w:50, h:50},
             {x:0, y:0, w:1000, h:25},
             {x:0, y:0, w:25, h:1000},
             //{x:475, y:0, w:25, h:500},
             {x:150, y:125, w:200, h:25},
             {x:25, y:200, w:50, h:25},
             {x:425, y:200, w:50, h:25},
             {x:150, y:275, w:200, h:25}];
var kill = [{x:225, y:300, w:50, h:10}];

var lowX = walls.reduce(function (prev, cur) {
    return Math.min(prev, cur.x);
}, Number.MAX_SAFE_INTEGER);
var highX = walls.reduce(function (prev, cur) {
    return Math.max(prev, cur.x + cur.w);
}, Number.MIN_SAFE_INTEGER);
var lowY = walls.reduce(function (prev, cur) {
    return Math.min(prev, cur.y);
}, Number.MAX_SAFE_INTEGER);
var  highY = walls.reduce(function (prev, cur) {
    return Math.max(prev, cur.y + cur.h);
}, Number.MIN_SAFE_INTEGER);


// Controls drawing and movement
function main() {
    requestAnimationFrame(main);

    move();
    draw()
}


// Handles all drawing
function draw() {
    drawBackground();
    drawWalls();
    drawKill();
    drawPlayer();
}

// Handle drawing each object with origin at bottom left and a camera position
function drawObject(obj) {
    if (CAMERA_FOLLOW) {
        camX = player.x - WIDTH/2;
        camY = player.y - HEIGHT/2;
    } else {
        camX = 0;
        camY = 0;
    }

    // Stop the camera from showing beyond the furthest walls
    if (camX < lowX) {
        camX = lowX;
    } else if (camX > highX - WIDTH) {
        camX = highX - WIDTH;
    }
    if (camY < lowY) {
        camY = lowY;
    } else if (camY > highY - HEIGHT) {
         camY = highY - HEIGHT;
    }

    x = obj.x;
    y = obj.y;
    w = obj.w;
    h = obj.h;

    // Set origin to bottom left
    y = HEIGHT - obj.y - obj.h;

    // Change values depending on camera location
    x = x - camX;
    y = y + camY;

    ctx.fillRect(x, y, w, h);
}

function drawBackground() {
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawWalls() {
    ctx.fillStyle = "#34495e";
    walls.forEach(function(wall) {
        drawObject(wall);
    });
}

function drawKill() {
    ctx.fillStyle = "#ef5350";
    kill.forEach(function(tile) {
        drawObject(tile);
    });
}

function drawPlayer() {
    if (collisionOL(player, walls)) {
        ctx.fillStyle = "#ff0000";
    } else {
        ctx.fillStyle = "#2ecc71";
    }
    drawObject(player);
}


// Move the player
function move() {
    moveHorizontal();
    moveJump();
    moveFall();
}

// Move the player until it hits a wall
function moveHorizontal() {
    for (var spd = speed; spd > 0; spd--) {
        var tempPlayer = modifyObject(player, dir * spd, 0, 0, 0);
        if (!collisionOL(tempPlayer, walls)) {
            player.x += dir * spd;
            break;
        }
    }
}

// Move the player up if possible and jumping
function moveJump() {
    tempPlayer = modifyObject(player, 0, -1, 0, 0);
    if (collisionOL(tempPlayer, walls) && up == 1) {
        yVel = jumpPower;
    }
    var tempPlayer = modifyObject(player, 0, 1, 0, 0);
    if (collisionOL(tempPlayer, walls)) {
        yVel = 0;
    } else if (yVel > 0) {
        for (var spd = yVel; spd > 0; spd--) {
            var tempPlayer = modifyObject(player, 0, spd, 0, 0);
            if (!collisionOL(tempPlayer, walls)) {
                player.y += spd;
                break;
            }
        }
    }
}

// Move the player down - Modity yVel and gravity
function moveFall() {
    var tempPlayer = modifyObject(player, 0, -1, 0, 0);
    if (collisionOL(tempPlayer, walls)) {
        yVel = 0;
    } else {
        yVel -= gravity;
        if (yVel < -1 * terminalVel) {
            yVel = -1 * terminalVel;
        }
        for (var spd = yVel; spd < 0; spd += gravity) {
            var tempPlayer = modifyObject(player, 0, spd, 0, 0);
            if (!collisionOL(tempPlayer, walls)) {
                player.y += spd;
                break;
            }
        }
    }
}


// Determines if two objects of type {x, y, w, h} are colliding
function collision(one, two) {
    return ((one.x < two.x + two.w) &&
            (one.x + one.w > two.x) &&
            (one.y < two.y + two.h) &&
            (one.y + one.h > two.y));
}

// Determines if the object is colliding with the list of objects
function collisionOL(obj, list) {
    return list.reduce(function (prev, cur) {
        return prev || collision(obj, cur);
    }, false);
}


// Return a new object that represents the given object modified by the given values
function modifyObject(obj, dx, dy, dw, dh) {
    return {x: obj.x + dx, y: obj.y + dy, w: obj.w + dw, h: obj.h + dh};
}


// Key Down Listener
function keyDown(e) {
    if (e.keyCode == 37) {
        left = 1;
    } else if (e.keyCode == 38) {
        up = 1;
    } else if (e.keyCode == 39) {
        right = 1;
    }
    dir = right - left;
}

// Key Up Listener
function keyUp(e) {
    if (e.keyCode == 37) {
        left = 0;
    } else if (e.keyCode == 38) {
        up = 0;
    } else if (e.keyCode == 39) {
        right = 0;
    }
    dir = right - left;
}
