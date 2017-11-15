var generate = function() {
  var c = document.getElementById("terrain");
  var ctx = c.getContext("2d");

  var width = c.width;
  var height = c.height;

  var CELL_SIZE = 8;
  var NUM_CELLS = height / CELL_SIZE;
  var MAX_HEIGHT = NUM_CELLS / 2;

  var heights = [];
  for (var row = 0; row < NUM_CELLS; row++) {
    heights.push([]);
    for (var col = 0; col < NUM_CELLS; col++) {
      heights[row].push(0);
    }
  }

  console.log(heights)

  heights[NUM_CELLS/2][NUM_CELLS/2] = MAX_HEIGHT;
  heights[0][0] = 0;
  heights[0][NUM_CELLS-1] = 0;
  heights[NUM_CELLS-1][0] = 0;
  heights[NUM_CELLS-1][NUM_CELLS-1] = 0;

  heights[NUM_CELLS/2][0] = 1;
  heights[NUM_CELLS/2][NUM_CELLS-1] = 1;
  heights[0][NUM_CELLS/2] = 1;
  heights[NUM_CELLS-1][NUM_CELLS/2] = 1;

  subdivide(0, 0, NUM_CELLS/2, NUM_CELLS/2);
  subdivide(0, NUM_CELLS/2, NUM_CELLS/2, NUM_CELLS-1);
  subdivide(NUM_CELLS/2, 0, NUM_CELLS-1, NUM_CELLS/2);
  subdivide(NUM_CELLS/2, NUM_CELLS/2, NUM_CELLS-1, NUM_CELLS-1);

  function subdivide(x1, y1, x2, y2) {
    if (x1 + 1 >= x2 || y1 + 1 >= y2) {
      return;
    }

    var tl = heights[y1][x1];
    var tr = heights[y1][x2];
    var bl = heights[y2][x1];
    var br = heights[y2][x2];

    var t = (tl + tr) / 2;
    var r = (tr + br) / 2;
    var b = (br + bl) / 2;
    var l = (bl + tl) / 2;
    var m = (t + r + b + l) / 4;

    var xavg = ~~((x1 + x2) / 2);
    var yavg = ~~((y1 + y2) / 2);

    if (heights[y1][xavg] != 0 || heights[y2][xavg] != 0 || heights[yavg][x1] != 0 || heights[yavg][x2] != 0 || heights[yavg][xavg] != 0) {
      // console.log('fucked kid');
      // console.log();
    }

    heights[y1][xavg] = randomNudge() + t;
    heights[y2][xavg] = randomNudge() + b;
    heights[yavg][x1] = randomNudge() + l;
    heights[yavg][x2] = randomNudge() + r;
    heights[yavg][xavg] = randomNudge() + m;

    subdivide(x1, y1, xavg, yavg);
    subdivide(x1, yavg, xavg, y2);
    subdivide(xavg, y1, x2, yavg);
    subdivide(xavg, yavg, x2, y2);
  }

  function randomNudge() {
    // return Math.floor(Math.random() * 5) / 2;
    return Math.floor(Math.random() * NUM_CELLS / 10) - Math.floor(1.5 * MAX_HEIGHT / 10);
  }

  function draw() {
    for (var row = 0; row < height/CELL_SIZE; row++) {
      for (var col = 0; col < width/CELL_SIZE; col++) {
        var r = g = b = Math.floor(255*heights[row][col]/MAX_HEIGHT).toString();
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        ctx.fillRect(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  draw();
}
