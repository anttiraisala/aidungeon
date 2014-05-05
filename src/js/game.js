var Game = function() {
  this.map = new Map();
  this.gui = new Gui();
  this.input = new Input();
  this.mainLoopState = MAINLOOPSTATE.MAP;
  this.actors = [];
  
  
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
    }, 0);
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
  
    if(this.input.lastMouseClickCanvasPosition) {
      this.gui.highlightedTiles = [];
      var mapCoordinate = this.gui.getMapCoordinateForCanvasLocation(this.input.lastMouseClickCanvasPosition.x, this.input.lastMouseClickCanvasPosition.y, this.actors);
      this.gui.highlightedTiles.push(mapCoordinate);
      this.input.lastMouseClickCanvasPosition = null;
    }
  
    //Execute loop only if player has pressed some key
    if(this.input.getKeyDowns().length === 0) {
      return;
    }

    // Make sure that player do not push keys too fast
    if(!this.input.isPlayerInputIntervalValid()) {
      return;
    }
    
    var playerHasActivity = false;

    //Move player if directional key
    var directionalKey = this.input.getPushedDirectionalKey();
    if (directionalKey) {
      var direction = this.input.getDirectionalInputKeyDirection(directionalKey);
      this.getPlayer().move(direction, this.map, this.actors);
      playerHasActivity = true;
    }
    
    //Execute monster AI if player has done some activity
    if(playerHasActivity) {
    var ctx = this;
      this.actors.forEach(function(actor) {
        if(!actor.isPlayer) {
          actor.actorAI.executeTurn(ctx.map, ctx.actors);
        }
      });
    }
  };
  
  /**
  * Returns player Actor instance.
  *
  * @return {Actor} player Actor instance
  */
  this.getPlayer = function() {
    var player = null;
    this.actors.forEach(function(actor) {
      if(actor.isPlayer) {
        player = actor;
      }
    });
    return player;
  };
};