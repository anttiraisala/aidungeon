var Game = function() {
  this.map = null;
  this.gui = new Gui();
  this.input = new Input();
  this.currentState = {
    mainLoopState : MAINLOOPSTATE.MAP,
    actors : []
  };
  
  
  this.init = function() {
    var ctx = this;
    $("#v_canvasMap").on("keydown", "", function(event) {
      //event.preventDefault();
      //console.log("keydown" + event.which);
      ctx.input.keyDowns[event.which] = true;
    });

    $("#v_canvasMap").on("keyup", "", function(event) {
      //event.preventDefault();
      //console.log("keyup" + event.which);

      ctx.input.keyDowns[event.which] = false;
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

    this.currentState.actors[0] = new Actor(9, 7, "Hero", TILE_TYPE.AVATAR);
    this.currentState.actors[1] = new Actor(4, 5, "orc", TILE_TYPE.MONSTER_ORC);
    this.currentState.actors[2] = new Actor(5, 3, "headless", TILE_TYPE.MONSTER_HEADLESS);

    this.map = new Map();
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

    // Make sure that keys do not repeat too fast
    if(this.input.checkPlayerInputInterval() === false) {
      return;
    }

    //Move player
    if (this.input.isDirectionalKeyPushed()) {
      var key = this.input.getPushedDirectionalKey();
      var direction = this.input.getDirectionalInputKeyDirection(key);
      this.getPlayer().move(direction, this.map);
    }
  };
  
  /**
  * Returns player Actor instance.
  *
  * @return {Actor} player Actor instance
  */
  this.getPlayer = function() {
    return this.currentState.actors[0];
  };
};