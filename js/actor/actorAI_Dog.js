/**
* AI for actors that are not controlled by player
*/
var ActorAI_Dog = function(actor) {
  this.actor = actor;
  this.sightRadius = 3;
  
  /**
  * Execute AI turn. Actor is allowed to do one activity in turn.
  *
  * @param {Map} map Map instance
  * @param {Array} actors All game actors
  */
  this.executeTurn = function(map, actors) {
    //Try to find player in sight
    var visibleActors = map.getActorsInFieldOfView(this.actor, this.sightRadius, actors);
    var visiblePlayer = ActorHelper.getPlayer(visibleActors);
    
    //Player is visble, find path to player and move toward it
    /*
    if(visiblePlayer) {
      var pathToPlayer = map.findPath(this.actor, visiblePlayer.x, visiblePlayer.y, actors);
      var firstStep = pathToPlayer.shift();
      
      if(firstStep) {
        var direction = map.getDirectionForCoordinate(this.actor.x, this.actor.y, firstStep[0], firstStep[1]);
        this.actor.move(direction, map, actors);
        return;
      }
    }
    */
    
    //No player in sight, wander to random direction
    var directions = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.WEST, DIRECTION.EAST];
    var randomDirection = directions[Math.floor(Math.random() * directions.length)];
    this.actor.move(randomDirection, map, actors);
  };
};