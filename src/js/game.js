var Game = function() {
  this.lastTime = 0;
  this.fpsCounter = 0;
  this.map = null;
  this.gui = new Gui();
  this.input = new Input();
  this.currentState = {
    mainLoopState : MAINLOOPSTATE.MAP,
    actors : []
  };
  this.tileProperties = [];
  
  
  this.init = function() {
    var ctx = this;
    $(".v_canvasMap:first").on("keydown", "", function(event) {
      //event.preventDefault();
      //console.log("keydown" + event.which);
      ctx.input.keyDowns[event.which] = true;
    });

    $(".v_canvasMap:first").on("keyup", "", function(event) {
      //event.preventDefault();
      //console.log("keyup" + event.which);

      ctx.input.keyDowns[event.which] = false;
    });

    $(".v_canvasMap:first").on("mousedown", function(event) {
      //event.preventDefault();
      $('.v_debugText2').val("mousedown / " + new Date().getTime());
    });

    $(".v_canvasMap:first").on("mouseup", function(event) {
      //event.preventDefault();
      $('.v_debugText4').val("mouseup / " + new Date().getTime());
    });

    $(".v_canvasMap:first").on("mousemove", function(event) {
      //event.preventDefault();
      $('.v_debugText3').val("mousemove / " + new Date().getTime());
    });

    $(".v_canvasMap:first").on("touchstart", function(event) {
      //event.preventDefault();
      $('.v_debugText5').val("touchstart / " + new Date().getTime());
    });

    $(".v_canvasMap:first").on("touchend", function(event) {
      //event.preventDefault();
      $('.v_debugText7').val("touchend / " + new Date().getTime());
    });

    $(".v_canvasMap:first").on("touchmove", function(event) {
      //event.preventDefault();
      $('.v_debugText6').val("touchmove / " + new Date().getTime());
    });

    this.currentState.actors[0] = new Actor(9, 7, "Hero", 301);
    this.currentState.actors[1] = new Actor(4, 5, "orc", 302);
    this.currentState.actors[2] = new Actor(5, 3, "headless", 303);

    this.map = new Map();
    this.map.init();
    
    this.tileProperties[1] = { d:[0, 0, 0]};
    this.tileProperties[11] = { d:[0, 0, 0]};
    this.tileProperties[12] = { d:[0, 0, 0]};
    
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
        //$('.v_debugText').val('directional=' + JSON.stringify(getKeyDowns(), null, 4));
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
    if (this.input.getKeyDowns().length > 0) {
      var currentTime = $.now();
      if (currentTime - this.input.lastKeyDownTime < this.input.keyDownMinInterval) {
        return;
      } else {
        this.input.lastKeyDownTime = currentTime;
      }
    }

    var directional = this.input.isDirectionalPushed();

    if (directional != 0) {
      var targetX = this.currentState.actors[0].x;
      var targetY = this.currentState.actors[0].y;

      if (directional == KEY.VK_UP) {
        targetY++;
      }
      if (directional == KEY.VK_DOWN) {
        targetY--;
      }
      if (directional == KEY.VK_LEFT) {
        targetX--;
      }
      if (directional == KEY.VK_RIGHT) {
        targetX++;
      }
      
      var targetTileIndex = this.map.tiles[targetX][targetY];          
      targetTileProperties = this.tileProperties[targetTileIndex];
      console.log(targetTileIndex);
      
      var allowed = true;
      if(targetTileProperties == undefined){
        allowed = false;
      }

      // Check if player can move to target tile
      if (allowed) {
        this.currentState.actors[0].x = targetX;
        this.currentState.actors[0].y = targetY;
      }
    }

    $('.v_debugText').val('x=' + this.currentState.actors[0].x + ' y=' + this.currentState.actors[0].y);

  };
};