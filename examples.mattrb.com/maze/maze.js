function initialize() {
    canvas = document.getElementById("maze");
    context = canvas.getContext("2d");
    main();
}

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

function main() {
    var vertices = [];
    for (var r = 0; r < canvas.height / 10; r++) {
        var row = [];
        for (var c = 0; c < canvas.width / 10; c++) {
            row.push(new Vertex(new Tuple(c, r)));
        }
        vertices.push(row);
    }
    console.log(vertices);
}

function Maze() {
    this.vertices;
    this.walls;
}

function Tuple(left, right) {
    /*
     * Fields
     * - this.left  - any
     * - this.right - any
     * Functions
     * - get()      - returns [left, right]
     */
    this.left = left;
    this.right = right;
    this.get = function() {
        return [this.left, this.right];
    }
}

function Vertex(position) {
    /*
     * Fields
     * - this.position   - Tuple(integer, integer)
     * - this.color      - hex color code
     * - this.neighbors  - Array of Vertex [top, right, bottom, left]
     * Functions
     * - this.setColor() - sets this.color
     */
    this.position = position;
    this.color = "#ffffff";
    this.neighbors = [null, null, null, null];
    this.setColor = function(color) {
        this.color = color;
    }
}

function keyDown(e) {
    if (e.keyCode = 37) {
        left = 1;
    } else if (e.keyCode = 38) {
        up = 1;
    } else if (e.keyCode = 39) {
        right = 1;
    } else if (e.keyCode = 40) {
        down = 1;
    }
}

function keyUp(e) {
    if (e.keyCode = 37) {
        left = 0;
    } else if (e.keyCode = 38) {
        up = 0;
    } else if (e.keyCode = 39) {
        right = 0;
    } else if (e.keyCode = 40) {
        down = 0;
    }
}
