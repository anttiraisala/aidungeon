/**
* Game map presentation.
*/
var Map = function() {
  this.tiles = [];
  this.width = 30;
  this.height = 30;
  
  /**
  * Inits default map data.
  */
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

    this.tiles = mapData;
  };
  
  /**
  * Find path in map for actor.
  * Uses https://github.com/qiao/PathFinding.js
  *
  * Returned path does not contain start actor current coordinate. If path target is blocked the 
  * paths last step is last possible step before the target block.
  *
  * @param {Actor} forActor Actor to whom the path is searched
  * @param {int} targetX Target map X coordinate
  * @param {int} targetY Target map Y coordinate
  * @param {Array} actors All game actors
  * @return {Array} Array of arrays that contain x in index 0 and y in index 1. Example: [ [ 1, 2 ], [ 1, 1 ]d ]. 
  * Empty array if no path is found.
  */
  this.findPath = function(forActor, targetX, targetY, actors) {
    if(!this.isTargetInMapBounds(targetX, targetY)) {
      return [];
    }
  
    var grid = new PF.Grid(this.width, this.height);
    
    //Set all blockin map coordinates
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if(this.tiles[x][y].isBlocking(forActor)) {
          if(x === targetX && y === targetY) {
            //Path target is blocking. Ignore it so path search is succesfull.
          }
          else {
            grid.setWalkableAt(x, y, false);
          }
        }
      }
    }
    
    //Set all blocking actors (not including actor to whom the path is searched)
    actors.forEach(function(actor) {
      if(forActor != actor) {
        if(actor.x === targetX && actor.y === targetY) {
          //Path target is blocking. Ignore it so path search is succesfull.
        }
        else {
          grid.setWalkableAt(actor.x, actor.y, false);
        }
      }
    });
    
    //Find and return path
    var finder = new PF.AStarFinder();
    var path = finder.findPath(forActor.x, forActor.y, targetX, targetY, grid);
    
    //Remove actor current position from path
    path.shift();
    
    return path;
  };
  
  /**
  * Is target coordinate blocking movement of given actor?
  *
  * @param {Actor} forActor Actor who tries to move to target
  * @param {int} targetX Target map X coordinate. Can be out of map bounds.
  * @param {int} targetY Target map Y coordinate. Can be out of map bounds.
  * @param {Array} actors All game actors
  * @return {boolean} True if target coordinate is blocked or out of bounds.
  */
  this.isBlocking = function(actor, targetX, targetY, actors) {
    if(!this.isTargetInMapBounds(targetX, targetY)) {
      //Target coordinate is not in map. Blocked.
      return true;
    }
    else if(this.tiles[targetX][targetY].isBlocking(actor)) {
      return true;
    }
    else if(ActorHelper.getActorForCoordinates(targetX, targetY, actors)) {
      return true;
    }
    return false;
  };
  
  /**
  * Is target coordinates out of map bounds?
  *
  * @param {int} targetX Target map X coordinate. Can be out of map bounds.
  * @param {int} targetY Target map Y coordinate. Can be out of map bounds.
  * @return {boolean} True if target coordinate is out of bounds.
  */
  this.isTargetInMapBounds = function(targetX, targetY) {
    return this.tiles[targetX] && this.tiles[targetX][targetY];
  };
  
  /**
  * Get DIRECTION from start coordinate to end coordinate.
  *
  * @param {int} startX Start map X coordinate
  * @param {int} startY Start map Y coordinate
  * @param {int} targetX Target map X coordinate
  * @param {int} targetY Target map Y coordinate
  * @return {String} DIRECTION contant value. Null if target is in west, east, south or north.
  */
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
  
  /**
  * Calculates actor FOV (Field Of View). Returns array of coordinates and 
  * info if actor sees to that coordinate. Actor do not see trouhg obstacles.
  *
  * Calculation is done with LightSource-object (from light_source.js).
  * light_source.js is from http://www.heyjavascript.com/blog/shadowcasting-field-of-view-on-canvas-with-javascript
  *
  * @param {Actor} actor Actor whos sight radius is calculated
  * @param {int} radius Actor sight radius in tiles.
  * @param {Array} actors All game actors
  * @return {Array} Array of objects with fields:
  * x: // x coordinate 
  * y: // y coordinate 
  * lightLevel: // the level of light on this tile. 1 is visible, 0 is not visible
  */
  this.calculateFieldOfView = function(actor, radius, actors) {
    var ctx = this;
    var isCoordinateBlockingFn = function(x, y) {
      return ctx.isBlocking(actor, x, y, actors);
    };
  
    var params = { 
      radius: radius, 
      mapSize: {
        x: this.width,
        y: this.height
      }, 
      getLightLevel: isCoordinateBlockingFn,
      gradient: false //Do not use gradients. Visible is 1 and not visible is 0
    };
    var light = new LightSource(params);
    
    /*
    * Calculate FOV
    * Result is array of objects with fields:
    * x: // x coordinate 
    * y: // y coordinate 
    * lightLevel: // the level of light on this tile. 1 is visible, 0 is not visible
    */
    return light.update(actor.x, actor.y);
  };
  
  /**
  * Returns all other actors that are in actors sight.
  *
  * @param {Actor} actor Actor whos sight radius is calculated
  * @param {int} radius Actor sight radius in tiles.
  * @param {Array} actors All game actors
  * @return {Array} Array of visible actors. Empty array if no actors are in sight.
  */
  this.getActorsInFieldOfView = function(forActor, radius, actors) {
    var fov = this.calculateFieldOfView(forActor, radius, actors);
    var visibleActors = [];
    
    actors.forEach(function(actor) {
      fov.forEach(function(coordinate) {
        if(actor.x === coordinate.x && 
            actor.y === coordinate.y && 
            coordinate.lightLevel === 1 && 
            forActor != actor) {
          if(visibleActors.indexOf(actor) === -1) { //fov contains duplicates
            visibleActors.push(actor);
          }
        }
      }, this);
    }, this);
    
    return visibleActors;
  };
};