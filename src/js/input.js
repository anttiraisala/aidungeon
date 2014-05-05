var Input = function() {
  this.keyDowns = [];
  this.lastKeyDownTime = 0;
  this.keyDownMinInterval = 100;
  this.lastMouseClickCanvasPosition = null;
  
  this.init = function() {
    var ctx = this;
    $("#v_canvasMap").on("keydown", "", function(event) {
      ctx.keyPressed(event.which);
    });

    $("#v_canvasMap").on("keyup", "", function(event) {
      ctx.keyReleased(event.which);
    });
    
    $("#v_canvasMap").on("mouseup", function(event) {
      ctx.lastMouseClickCanvasPosition = ctx.getCanvasMousePosition(event);
    });
  };
  
  this.getCanvasMousePosition = function(mouseEvent) {
    var rect = $("#v_canvasMap")[0].getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }
  
  this.keyPressed = function(key) {
    this.keyDowns[key] = true;
  };
  
  this.keyReleased = function(key) {
    this.keyDowns[key] = false;
  };
  
  this.getNextKeyFromQueue = function() {
    return this.keyQueue.shift();
  };
  
  this.isPlayerInputIntervalValid = function() {
    var currentTime = new Date().getTime();
    if (currentTime - this.lastKeyDownTime < this.keyDownMinInterval) {
      return false;
    }
    else {
      this.lastKeyDownTime = currentTime;
      return true;
    }
  };

  this.isKeyDown = function(keyCode) {
    var result = 0;

    if (this.keyDowns[keyCode]) {
      result = keyCode;
    }

    return result;
  };

  this.isDirectionalKey = function(key) {
    return key === KEY.VK_UP || key === KEY.VK_DOWN || key === KEY.VK_LEFT || key === KEY.VK_RIGHT;
  };
  
  this.getPushedDirectionalKey = function() {
    var result = 0;

    if (this.isKeyDown(KEY.VK_UP)) {
      return KEY.VK_UP;
    }
    else if (this.isKeyDown(KEY.VK_DOWN)) {
      return KEY.VK_DOWN;
    }
    else if (this.isKeyDown(KEY.VK_LEFT)) {
      return KEY.VK_LEFT;
    }
    else if (this.isKeyDown(KEY.VK_RIGHT)) {
      return KEY.VK_RIGHT;
    }

    return result;
  };
  
  this.getDirectionalInputKeyDirection = function(key) {
    if (key == KEY.VK_UP) {
      return DIRECTION.NORTH;
    }
    else if (key == KEY.VK_DOWN) {
      return DIRECTION.SOUTH;
    }
    else if (key == KEY.VK_LEFT) {
      return DIRECTION.WEST;
    }
    else if (key == KEY.VK_RIGHT) {
      return DIRECTION.EAST;
    }
    return null;
  };

  this.getKeyDowns = function() {
    var result = [];

    $.each(this.keyDowns, function(index, value) {
      if (value == true) {
        result.push(index);
      };
    });

    return result;
  };
};