/**
* Actor is player or monster
*/
var Actor = function(x, y, name, tileType) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.tileType = tileType;
  
  /**
  * Move actor in map to given direction. Validates movement target tile.
  *
  * @param {string} direction DIRECTION constant value
  * @param {Map} map Map instance
  * @return {boolean} true if movement was succesfull, else false
  */
  this.move = function(direction, map) {
    var targetX = this.x;
    var targetY = this.y;

    if (direction == DIRECTION.NORTH) {
      targetY++;
    }
    if (direction == DIRECTION.SOUTH) {
      targetY--;
    }
    if (direction == DIRECTION.WEST) {
      targetX--;
    }
    if (direction == DIRECTION.EAST) {
      targetX++;
    }
    
    // Check if player can move to target tile
    if(!map.tiles[targetX]) {
      return false;
    }
    else if(!map.tiles[targetX][targetY]) {
      return false;
    }
    
    var targetTile = map.tiles[targetX][targetY];
    if (targetTile.isBlocking(this) === false) {
      this.x = targetX;
      this.y = targetY;
      return true;
    }
    else {
      return false;
    }
  }
};