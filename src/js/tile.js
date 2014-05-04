/**
* Map single coordinate tile
*/
var Tile = function(type) {
  this.type = type;
  
  /**
  * Is given actor prohibited of entering this tile?
  *
  * @param {Actor} actor Actor that is moving to this tile
  * @param {boolean} true if moving to this tile is prohibited, else false.
  */
  this.isBlocking = function(actor) {
    if(this.type == TILE_TYPE.GRASS_LANDS ||
        this.type == TILE_TYPE.PLANK_FLOOR ||
        this.type == TILE_TYPE.SECRET_WALL) {
      return false;
    }
    
    return true;
  };
};