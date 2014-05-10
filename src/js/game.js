/**
* Game main instance. Start game with init().
*/
var Game = function() {
  this.map = new Map();
  this.gui = new Gui();
  this.input = new Input();
  this.mainLoopState = MAINLOOPSTATE.MAP;
  this.actors = [];
  this.lastPlayerPathQueueExecutionTime = 0;
  this.playerPathQueueExecutionInterval = 500;
  
  /**
  * Init game and start resource loading.
  */
  this.init = function() {
    this.actors.push(new Actor(12, 7, "Hero", TILE_TYPE.AVATAR, true));
    this.actors.push(new Actor(4, 5, "orc", TILE_TYPE.MONSTER_ORC, false));
    this.actors.push(new Actor(5, 3, "headless", TILE_TYPE.MONSTER_HEADLESS, false));
    
    this.map.init();
    this.input.init();
    
    var ctx = this;
    this.gui.init(this.map, this.actors, function() {
      ctx.start();
    });
  };

  /**
  * Resource loading is complete. Start game.
  */
  this.start = function() {
    var ctx = this;
    window.setInterval(function() {
      ctx.mainLoop();
    }, 1000 / 60);
    // TODO: map could be updated only when necessary, i.e. when cellLoop has advanced or actor has moved etc.
  };
  
  /**
  * Main logic loop for game. This is called at 60 fps.
  */
  this.mainLoop = function() {
    switch(this.mainLoopState) {
      case MAINLOOPSTATE.MAP : {
        this.mapLoop();
        break;
      }
      case MAINLOOPSTATE.DISCUSSION : {
        break;
      }
    };
  };
  
  /**
  * Main logic loop for map state. Hadles player movement and monster AI execution.
  */
  this.mapLoop = function() {
    var player = ActorHelper.getPlayer(this.actors);
    var playerHasActivity = false;
  
    //Check if player is controlled by mouse
    if(this.input.lastMouseClickCanvasPosition) {
      playerHasActivity = this.handlePlayerMapMouseClick(player);
    }
  
    //Check if player has pressed some keyboard key and make sure that player do not push keys too fast
    if(this.input.getKeyDowns().length > 0 && this.input.isPlayerInputIntervalValid()) {
      playerHasActivity = this.handlePlayerKeyboardPress(player);
      
      //Player is controlled by keys, reset player path queue
      player.resetMovementPathQueue();
    }
    
    //Continue player path queue if it exists
    if(!playerHasActivity && player.hasMovementPathQueue() && this.checkPlayerPathQueueExecutionInterval()) {
      playerHasActivity = player.handleMovementPathQueue(this.map, this.actors);
    }
    
    //Execute monster AI if player has done some activity
    if(playerHasActivity) {
      this.actors.forEach(function(actor) {
        if(!actor.isPlayer) {
          actor.actorAI.executeTurn(this.map, this.actors);
        }
      }, this);
    }
  };
  
  /**
  * Handle player keyboard key presses.
  *
  * @param {Actor} player Player that is controlled.
  * @return {boolean} true if player is moved (or tried to move)
  */
  this.handlePlayerKeyboardPress = function(player) {
    //Move player if directional key is pushed
    var directionalKey = this.input.getPushedDirectionalKey();
    if (directionalKey) {
      var direction = this.input.getDirectionalInputKeyDirection(directionalKey);
      player.move(direction, this.map, this.actors);
      return true;
    }
    return false;
  };
  
  /**
  * Handle player mouse clicks.
  *
  * @param {Actor} player Player that is controlled.
  * @return {boolean} true if mouse click coordinate is valid path target.
  */
  this.handlePlayerMapMouseClick = function(player) {
    var playerHasActivity = false;
    
    //Get map coordinate for click
    var mapCoordinate = this.gui.getMapCoordinateForCanvasLocation(this.input.lastMouseClickCanvasPosition.x, this.input.lastMouseClickCanvasPosition.y, this.actors);
    
    if(mapCoordinate) {
      //Find path to target
      var path = this.map.findPath(player, mapCoordinate.x, mapCoordinate.y, this.actors);
      
      //Remove first step hat is players position
      path.shift();
      
      player.movementPathQueue = path;
      
      if(path.length > 0) {
        playerHasActivity = true;
      }
    }
    
    //Reset mouse click info. This click is handled.
    this.input.lastMouseClickCanvasPosition = null;
    
    return playerHasActivity;
  };
  
  /**
  * Check if player path queue execution interval is valid.
  *
  * @return {boolean} true if path queue execution is allowed.
  */
  this.checkPlayerPathQueueExecutionInterval = function() {
    var currentTime = new Date().getTime();
    if (currentTime - this.lastPlayerPathQueueExecutionTime < this.playerPathQueueExecutionInterval) {
      return false;
    }
    else {
      this.lastPlayerPathQueueExecutionTime = currentTime;
      return true;
    }
  };
};