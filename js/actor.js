/**
* Actor is player or monster
*/
var Actor = function(x, y, name, tileType, isPlayer) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.tileType = tileType;
  this.isPlayer = isPlayer;
  this.actorAI;
  
  this.init = function() {
    if(!this.isPlayer) {
      this.actorAI = new ActorAI(this);
    }
  };
  
  /**
  * Move actor in map to given direction. Validates movement target tile.
  *
  * @param {string} direction DIRECTION constant value
  * @param {Map} map Map instance
  * @param {Array} actors All actors in map
  * @return {boolean} true if movement was succesfull, else false
  */
  this.move = function(direction, map, actors) {
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
    
    // Check if player can move to target tile and that target is in map limits
    if(!map.tiles[targetX]) {
      return false;
    }
    else if(!map.tiles[targetX][targetY]) {
      return false;
    }
    
    var targetTile = map.tiles[targetX][targetY];
    if (targetTile.isBlocking(this)) {
      return false;
    }
    
    //Check that there is no another actor in target coordinates
    var anotherActorFound = false;
    actors.forEach(function(actor) {
      if(actor.x === targetX && actor.y === targetY) {
        anotherActorFound = true;
      }
    });
    if(anotherActorFound) {
      return false;
    }
    
    this.x = targetX;
    this.y = targetY;
  }
  
  this.init();
};