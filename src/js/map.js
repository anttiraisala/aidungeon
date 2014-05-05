var Map = function() {
  this.tiles = [];
  this.width = 30;
  this.height = 30;
  
  this.init = function() {
    var mapData = [];
    for (var x = 0; x < this.width; x++) {
      mapData[x] = new Array(this.height);
      for (var y = 0; y < this.height; y++) {
        mapData[x][y] = new Tile(TILE_TYPE.GRASS_LANDS);
      }
    }

    // House
    mapData[6][3] = new Tile(TILE_TYPE.WALL);
    mapData[6][2] = new Tile(TILE_TYPE.WALL);
    mapData[6][1] = new Tile(TILE_TYPE.SECRET_WALL);
    // Secret Door !
    mapData[6][0] = new Tile(TILE_TYPE.WALL);
    mapData[7][0] = new Tile(TILE_TYPE.WALL);
    mapData[8][0] = new Tile(TILE_TYPE.WALL);
    mapData[9][0] = new Tile(TILE_TYPE.WALL);
    mapData[9][1] = new Tile(TILE_TYPE.WALL);
    mapData[9][2] = new Tile(TILE_TYPE.WALL);
    mapData[9][3] = new Tile(TILE_TYPE.WALL);
    mapData[8][3] = new Tile(TILE_TYPE.WALL);
    //
    // Floor
    mapData[7][3] = new Tile(TILE_TYPE.PLANK_FLOOR);
    mapData[7][2] = new Tile(TILE_TYPE.PLANK_FLOOR);
    mapData[7][1] = new Tile(TILE_TYPE.PLANK_FLOOR);
    mapData[8][2] = new Tile(TILE_TYPE.PLANK_FLOOR);
    mapData[8][1] = new Tile(TILE_TYPE.PLANK_FLOOR);

    // Deeper water
    mapData[0][8] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[0][7] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[0][6] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[0][5] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[1][8] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[1][7] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[1][6] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[1][5] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[1][4] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[2][7] = new Tile(TILE_TYPE.DEEP_WATER);
    mapData[2][6] = new Tile(TILE_TYPE.DEEP_WATER);

    // Shallow water
    mapData[2][5] = new Tile(TILE_TYPE.SHALLOW_WATER);
    mapData[2][4] = new Tile(TILE_TYPE.SHALLOW_WATER);
    mapData[3][5] = new Tile(TILE_TYPE.SHALLOW_WATER);
    mapData[3][4] = new Tile(TILE_TYPE.SHALLOW_WATER);
    mapData[3][3] = new Tile(TILE_TYPE.SHALLOW_WATER);

    // Dense woods
    mapData[7][8] = new Tile(TILE_TYPE.DENSE_WOODS);

    // Smaller woods
    mapData[6][7] = new Tile(TILE_TYPE.LESSER_WOODS);
    mapData[7][7] = new Tile(TILE_TYPE.LESSER_WOODS);

    // Low Mountains
    mapData[1][3] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[0][2] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[3][2] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[0][1] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[3][1] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[1][0] = new Tile(TILE_TYPE.LOW_MOUNTAINS);
    mapData[2][0] = new Tile(TILE_TYPE.LOW_MOUNTAINS);

    // Medium Mountains
    mapData[1][2] = new Tile(TILE_TYPE.MEDIUM_MOUNTAINS);
    mapData[2][2] = new Tile(TILE_TYPE.MEDIUM_MOUNTAINS);
    mapData[2][1] = new Tile(TILE_TYPE.MEDIUM_MOUNTAINS);

    // High Mountains
    mapData[1][1] = new Tile(TILE_TYPE.HIGH_MOUNTAINS);

    // Marsh
    mapData[2][3] = new Tile(TILE_TYPE.MARSH);

    // Strange Worm
    mapData[0][4] = new Tile(TILE_TYPE.STRANGE_WORM);

    //console.log('mapData=' + JSON.stringify(mapData, null, 4));

    this.tiles = mapData;
  };
  
  this.findPath = function(forActor, targetX, targetY, actors) {
    var grid = new PF.Grid(this.width, this.height);
    
    //Set all blockin map coordinates
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if(this.tiles[x][y].isBlocking(forActor)) {
          grid.setWalkableAt(x, y, false);
        }
      }
    }
    
    //Set all blocking actors (not including actor to whom the path is searched)
    actors.forEach(function(actor) {
      if(forActor != actor) {
        grid.setWalkableAt(actor.x, actor.y, false);
      }
    });
    
    //Find and return path
    var finder = new PF.AStarFinder();
    return finder.findPath(forActor.x, forActor.y, targetX, targetY, grid);;
  };
  
  this.getDirectionForCoordinate = function(startX, startY, targetX, targetY) {
    if(targetX === startX) {
      if(targetY > startY) {
        return DIRECTION.SOUTH;
      }
      else if(targetY < startY) {
        return DIRECTION.NORTH;
      }
    }
    else if(targetY === startY) {
      if(targetX > startX) {
        return DIRECTION.EAST;
      }
      else if(targetX < startX) {
        return DIRECTION.WEST;
      }
    }
    
    return null;
  };
};