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
  this.movementPathQueue = [];
  
  /**
  * Init actor. Called automatically.
  */
  this.init = function() {
    if(!this.isPlayer) {
      this.actorAI = new ActorAI(this);
    }
  };
  
  /**
  * Reset path queue.
  */
  this.resetMovementPathQueue = function() {
    return this.movementPathQueue = [];
  };
  
  /**
  * Do this actor have a movement path queue?
  */
  this.hasMovementPathQueue = function() {
    return this.movementPathQueue.length > 0;
  };
  
  /**
  * Handle next step of movement path queue.
  *
  * @param {Map} map Map instance
  * @param {Array} actors All actors in map
  * @return {boolean} True if movement was succesfull, else false
  */
  this.handleMovementPathQueue = function(map, actors) {
    if(this.movementPathQueue.length === 0) {
      return false;
    }
    
    //Hadle next path step
    var nextPathStep = this.movementPathQueue.shift();
    var direction = map.getDirectionForCoordinate(this.x, this.y, nextPathStep[0], nextPathStep[1]);
    var movementSuccess = this.move(direction, map, actors);
    
    //Cancel the whole queue if movement is not possible. Another actor might have moved to path.
    if(!movementSuccess) {
      this.resetMovementPathQueue();
    }
    
    return movementSuccess;
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
      targetY--;
    }
    if (direction == DIRECTION.SOUTH) {
      targetY++;
    }
    if (direction == DIRECTION.WEST) {
      targetX--;
    }
    if (direction == DIRECTION.EAST) {
      targetX++;
    }
    
    // Check if player can move to target tile and that target is in map limits
    if(map.isBlocking(this, targetX, targetY, actors)) {
      return false;
    }
    
    this.x = targetX;
    this.y = targetY;
    
    return true;
  };
  
  this.init();
};