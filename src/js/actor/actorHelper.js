/**
* Singleton helper for common actor helper functions.
*/
var ActorHelper = new function() {
  /**
  * Returns player Actor instance.
  *
  * @param {Array} actors All  actors
  * @return {Actor} Player Actor instance. Null if not found.
  */
  this.getPlayer = function(actors) {
    var player = null;
    actors.forEach(function(actor) {
      if(actor.isPlayer) {
        player = actor;
      }
    });
    return player;
  };
  
  /**
  * Returns player Actor instance.
  *
  * @param {int} x
  * @param {int} y
  * @param {Array} actors All  actors
  * @return {Actor} Actor instance. Null if not found.
  */
  this.getActorForCoordinates = function(x, y, actors) {
    var result = null;
    actors.forEach(function(actor) {
      if(actor.x === x && actor.y === y) {
        result = actor;
      }
    });
    return result;
  };
};