/**
 * @author Antti
 */
var Gui = function() {

  this.imageCellLoops = [];
  this.rawImageRepository = new RawImageRepository();
  this.lastAnimateStartTime = 0;
  this.dAnimateStartTime = 0;
  this.mapCanvasWidth = 800;
  this.mapCanvasHeight = 600;
  this.mapTileSize = 16;
  this.mapCanvasZoom = 3;
  this.fpsCounter = 0;
  this.lastAnimationFrameTime = 0;
  this.canvasCtx;

  /**
   * requestAnim shim layer by Paul Irish
   * Finds the first API that works to optimize the animation loop,
   * otherwise defaults to setTimeout().
   */
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(/* function */callback, /* DOMElement */element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  this.init = function(map, actors, callback) {
    this.rawImageRepository.addSourcePath("imgs/tileSets/Ultima_5_-_Tiles.png");
    this.canvasCtx = $("#v_canvasMap")[0].getContext('2d');

    var ctx = this;
    this.rawImageRepository.loadRawImages(function() {
      ctx.createImageCellLoops();
      ctx.animationTimeKeepingLoop();
      
      window.setInterval(function() {
        ctx.drawMap(map, actors);
      }, 0);
      
      callback();
    });
  };

  this.drawMap = function(map, actors) {
    var tileSize = this.mapTileSize * this.mapCanvasZoom;
    var horizontalTileCount = Math.ceil(this.mapCanvasWidth / tileSize);
    var verticalTileCount = Math.ceil(this.mapCanvasHeight / tileSize);

    this.canvasCtx.clearRect(0, 0, this.mapCanvasWidth, this.mapCanvasHeight);
    this.canvasCtx.fillStyle = "#FF0000";

    //Center map to player
    var bottomLeftCornerX = actors[0].x - Math.ceil(horizontalTileCount / 2);
    var bottomLeftCornerY = actors[0].y - Math.ceil(verticalTileCount / 2);

    for (var y = 0; y < verticalTileCount; y++) {
      for (var x = 0; x < horizontalTileCount; x++) {

        var mapDataX = bottomLeftCornerX + x;
        var mapDataY = bottomLeftCornerY + y;

        if (mapDataX < 0 || mapDataX >= map.width || mapDataY < 0 || mapDataY >= map.height) {
          continue;
        }

        var mapTile = map.tiles[mapDataX][mapDataY];

        if (this.imageCellLoops[mapTile.type] != undefined) {
          var cellLoop = this.imageCellLoops[mapTile.type];
          this.drawImageCellOntoCanvas(this.canvasCtx, cellLoop.getCurrentFrame(), x * tileSize, (verticalTileCount - y - 1) * tileSize, this.mapCanvasZoom);

        } else {
          this.canvasCtx.fillStyle = "#FF0000"; //White
          this.canvasCtx.fillRect(x * tileSize, (verticalTileCount - y - 1) * tileSize, tileSize, tileSize);
        }

      }
    }

    // Draw actors
    var ctx = this;
    actors.forEach(function(actor) {
      var ax = actor.x;
      var ay = actor.y;
      var cLoop = ctx.imageCellLoops[actor.tileType];

      var x = ax - bottomLeftCornerX;
      var y = ay - bottomLeftCornerY;

      if (x >= 0 && x < horizontalTileCount && y >= 0 && y < verticalTileCount) {
        ctx.drawImageCellOntoCanvas(ctx.canvasCtx, cLoop.getCurrentFrame(), x * tileSize, (verticalTileCount - y - 1) * tileSize, ctx.mapCanvasZoom);
      }
    });
  };
  
  this.animationTimeKeepingLoop = function() {
    var ctx = this;
    requestAnimFrame(function() {
      ctx.animationTimeKeepingLoop();
    });

    // Finally update fpsCounter
    var d = new Date();
    var currentTime = d.getTime();

    // Update global time keeping variables
    this.dAnimateStartTime = currentTime - this.lastAnimateStartTime;
    this.lastAnimateStartTime = currentTime;

    this.fpsCounter++;
    if (currentTime - this.lastAnimationFrameTime >= 1000) {
      this.lastAnimationFrameTime = currentTime;

      var hours = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();

      $("#fpsCounter").text(this.fpsCounter + "fps : " + currentTime + " : " + (hours < 10 ? "0" : "") + hours + "." + (minutes < 10 ? "0" : "") + minutes + "." + (seconds < 10 ? "0" : "") + seconds + " :: " + this.dAnimateStartTime + "ms");
      this.fpsCounter = 0;
    }

    this.imageCellLoops.forEach(function(imageCellLoop) {
      imageCellLoop.advanceTime(ctx);
    });
  };
  
  this.drawImageCellOntoCanvas = function(targetCanvasContext, sourceImageCell, targetX, targetY, zoom) {
    if (zoom == undefined) {
      zoom = 1;
    }

    targetCanvasContext.drawImage(sourceImageCell.rawImageSource, sourceImageCell.startX, sourceImageCell.startY, sourceImageCell.width, sourceImageCell.height, targetX - sourceImageCell.hotSpotX, targetY - sourceImageCell.hotSpotY, sourceImageCell.width * zoom, sourceImageCell.height * zoom);
  };

  this.createImageCellLoops = function() {
    var imageCellLoop1 = new ImageCellLoop();
    imageCellLoop1.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 388, 320, 26, 32, 13, 32), 500);
    imageCellLoop1.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 420, 320, 24, 32, 10, 32), 250);
    imageCellLoop1.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 452, 320, 26, 32, 13, 32), 500);
    imageCellLoop1.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 486, 320, 24, 32, 11, 32), 250);

    var deepWaterLoop = new ImageCellLoop();
    deepWaterLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 16, 0, 16, 16, 0, 0), 500);
    deepWaterLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 32, 0, 16, 16, 0, 0), 500);
    //
    this.imageCellLoops[TILE_TYPE.DEEP_WATER] = deepWaterLoop;

    var shallowWaterLoop = new ImageCellLoop();
    shallowWaterLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 48, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.SHALLOW_WATER] = shallowWaterLoop;

    var denseWoodsLoop = new ImageCellLoop();
    denseWoodsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 160, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.DENSE_WOODS] = denseWoodsLoop;

    var lesserWoodsLoop = new ImageCellLoop();
    lesserWoodsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 144, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.LESSER_WOODS] = lesserWoodsLoop;

    var wallLoop = new ImageCellLoop();
    wallLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 240, 32, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.WALL] = wallLoop;

    var secretWallLoop = new ImageCellLoop();
    secretWallLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 224, 32, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.SECRET_WALL] = secretWallLoop;

    var plankFloorLoop = new ImageCellLoop();
    plankFloorLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 144, 32, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.PLANK_FLOOR] = plankFloorLoop;

    var grassLandsLoop = new ImageCellLoop();
    grassLandsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 82, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.GRASS_LANDS] = grassLandsLoop;

    var highMountainsLoop = new ImageCellLoop();
    highMountainsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 208, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.HIGH_MOUNTAINS] = highMountainsLoop;

    var medMountainsLoop = new ImageCellLoop();
    medMountainsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 192, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.MEDIUM_MOUNTAINS] = medMountainsLoop;

    var lowMountainsLoop = new ImageCellLoop();
    lowMountainsLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 176, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.LOW_MOUNTAINS] = lowMountainsLoop;

    var marshLoop = new ImageCellLoop();
    marshLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 64, 0, 16, 16, 0, 0), 1000);
    //
    this.imageCellLoops[TILE_TYPE.MARSH] = marshLoop;

    var strangeWormLoop = new ImageCellLoop();
    strangeWormLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 384, 240, 16, 16, 0, 0), 4001);
    strangeWormLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 400, 240, 16, 16, 0, 0), 333);
    strangeWormLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 416, 240, 16, 16, 0, 0), 333);
    strangeWormLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 432, 240, 16, 16, 0, 0), 333);
    //
    this.imageCellLoops[TILE_TYPE.STRANGE_WORM] = strangeWormLoop;

    var avatarLoop = new ImageCellLoop();
    avatarLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 192, 160, 16, 16, 0, 0), 1000);
    avatarLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 208, 160, 16, 16, 0, 0), 300);
    avatarLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 224, 160, 16, 16, 0, 0), 1000);
    avatarLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 240, 160, 16, 16, 0, 0), 300);
    //
    this.imageCellLoops[TILE_TYPE.AVATAR] = avatarLoop;

    var orcLoop = new ImageCellLoop();
    orcLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 0, 224, 16, 16, 0, 0), 750);
    orcLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 16, 224, 16, 16, 0, 0), 350);
    orcLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 32, 224, 16, 16, 0, 0), 350);
    orcLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 48, 224, 16, 16, 0, 0), 1250);
    //
    this.imageCellLoops[TILE_TYPE.MONSTER_ORC] = orcLoop;

    var headlessLoop = new ImageCellLoop();
    headlessLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 256, 224, 16, 16, 0, 0), 350);
    headlessLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 272, 224, 16, 16, 0, 0), 350);
    headlessLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 288, 224, 16, 16, 0, 0), 350);
    headlessLoop.addFrame(new ImageCell(this.rawImageRepository.getRawImages()[0], 304, 224, 16, 16, 0, 0), 900);
    //
    this.imageCellLoops[TILE_TYPE.MONSTER_HEADLESS] = headlessLoop;

  };
  
};