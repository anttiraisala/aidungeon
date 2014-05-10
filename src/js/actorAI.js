var ActorAI = function(actor) {
  this.actor = actor;
  this.sightRadius = 3;
  
  this.executeTurn = function(map, actors) {
    //Try to find player in sight
    var visibleActors = map.getActorsInFieldOfView(this.actor, this.sightRadius, actors);
    var visiblePlayer = ActorHelper.getPlayer(actors);
    
    //Player is visble, find path to player and move toward it
    if(visiblePlayer) {
      var pathToPlayer = map.findPath(this.actor, visiblePlayer.x, visiblePlayer.y, actors);
      
      //Remove first step that is the AIPlayer itself
      pathToPlayer.shift()
      var firstStep = pathToPlayer.shift();
      
      if(firstStep) {
        var direction = map.getDirectionForCoordinate(this.actor.x, this.actor.y, firstStep[0], firstStep[1]);
        this.actor.move(direction, map, actors);
        return;
      }
    }
    
    //No player in sight, wander to random direction
    var directions = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.WEST, DIRECTION.EAST];
    var randomDirection = directions[Math.floor(Math.random() * directions.length)];
    this.actor.move(randomDirection, map, actors);
  };
  
};