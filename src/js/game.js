var Game = function() {
  this.map = new Map();
  this.gui = new Gui();
  this.input = new Input();
  this.mainLoopState = MAINLOOPSTATE.MAP;
  this.actors = [];
  this.lastPlayerPathQueueExecutionTime = 0;
  this.playerPathQueueExecutionInterval = 500;
  
  
  this.init = function() {
    $("#v_canvasMap").on("mousemove", function(event) {
      //event.preventDefault();
      $('.v_debugText3').val("mousemove / " + new Date().getTime());
    });

    $("#v_canvasMap").on("touchstart", function(event) {
      //event.preventDefault();
      $('.v_debugText5').val("touchstart / " + new Date().getTime());
    });

    $("#v_canvasMap").on("touchend", function(event) {
      //event.preventDefault();
      $('.v_debugText7').val("touchend / " + new Date().getTime());
    });

    $("#v_canvasMap").on("touchmove", function(event) {
      //event.preventDefault();
      $('.v_debugText6').val("touchmove / " + new Date().getTime());
    });

    this.actors.push(new Actor(9, 7, "Hero", TILE_TYPE.AVATAR, true));
    this.actors.push(new Actor(4, 5, "orc", TILE_TYPE.MONSTER_ORC, false));
    this.actors.push(new Actor(5, 3, "headless", TILE_TYPE.MONSTER_HEADLESS, false));
    
    this.map.init();
    this.input.init();
    
    var ctx = this;
    this.gui.init(this.map, this.actors, function() {
      ctx.start();
    });
  };

  this.start = function() {
    var ctx = this;
    window.setInterval(function() {
      ctx.mainLoop();
    }, 1000 / 60);
    // TODO: map could be updated only when necessary, i.e. when cellLoop has advanced or actor has moved etc.
  };
  
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
      
      //Player is controlled by keys, remove highlight and reset player path queue
      this.gui.highlightedTiles = [];
      player.resetMovementPathQueue();
    }
    
    //Continue player path queue if it exists
    if(!playerHasActivity && player.hasMovementPathQueue() && this.checkPlayerPathQueueExecutionInterval()) {
      playerHasActivity = player.handleMovementPathQueue(this.map, this.actors);
    }
    else if(!player.hasMovementPathQueue()) {
      //No more path queue, remove highlights
      this.gui.highlightedTiles = [];
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
  
  this.handlePlayerMapMouseClick = function(player) {
    var playerHasActivity = false;
  
    //Remove old highlights
    this.gui.highlightedTiles = [];
    
    //Get map coordinate for click
    var mapCoordinate = this.gui.getMapCoordinateForCanvasLocation(this.input.lastMouseClickCanvasPosition.x, this.input.lastMouseClickCanvasPosition.y, this.actors);
    
    if(mapCoordinate) {
      //Find path to target
      var path = this.map.findPath(player, mapCoordinate.x, mapCoordinate.y, this.actors);
      
      //Remove first step hat is players position
      path.shift();
      
      player.movementPathQueue = path;
      this.gui.highlightedTiles = path;
      
      if(path.length > 0) {
        playerHasActivity = true;
      }
    }
    
    //Reset mouse click info. This click is handled.
    this.input.lastMouseClickCanvasPosition = null;
    
    return playerHasActivity;
  };
  
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