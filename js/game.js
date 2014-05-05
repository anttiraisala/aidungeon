var Game = function() {
  this.map = new Map();
  this.gui = new Gui();
  this.input = new Input();
  this.currentState = {
    mainLoopState : MAINLOOPSTATE.MAP,
    actors : []
  };
  
  
  this.init = function() {
    var ctx = this;
    $("#v_canvasMap").on("keydown", "", function(event) {
      ctx.input.keyPressed(event.which);
    });

    $("#v_canvasMap").on("keyup", "", function(event) {
      ctx.input.keyReleased(event.which);
    });

    $("#v_canvasMap").on("mousedown", function(event) {
      //event.preventDefault();
      $('.v_debugText2').val("mousedown / " + new Date().getTime());
    });

    $("#v_canvasMap").on("mouseup", function(event) {
      //event.preventDefault();
      $('.v_debugText4').val("mouseup / " + new Date().getTime());
    });

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

    this.currentState.actors.push(new Actor(9, 7, "Hero", TILE_TYPE.AVATAR, true));
    this.currentState.actors.push(new Actor(4, 5, "orc", TILE_TYPE.MONSTER_ORC, false));
    this.currentState.actors.push(new Actor(5, 3, "headless", TILE_TYPE.MONSTER_HEADLESS, false));
    
    this.map.init();
    
    var ctx = this;
    this.gui.init(this.map, this.currentState.actors, function() {
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

    switch(this.currentState.mainLoopState) {
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
      this.getPlayer().move(direction, this.map, this.currentState.actors);
      playerHasActivity = true;
    }
    
    //Execute monster AI if player has done some activity
    if(playerHasActivity) {
    var ctx = this;
      this.currentState.actors.forEach(function(actor) {
        if(!actor.isPlayer) {
          actor.actorAI.executeTurn(ctx.map, ctx.currentState.actors);
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
    this.currentState.actors.forEach(function(actor) {
      if(actor.isPlayer) {
        player = actor;
      }
    });
    return player;
  };
};