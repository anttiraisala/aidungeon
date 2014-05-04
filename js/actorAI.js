var ActorAI = function(actor) {
  this.actor = actor;
  
  this.executeTurn = function(map, actors) {
    //Move to random direction
    var directions = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.WEST, DIRECTION.EAST];
    var randomDirection = directions[Math.floor(Math.random() * directions.length)];
    this.actor.move(randomDirection, map, actors);
  };
};