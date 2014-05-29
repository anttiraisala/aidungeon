/**
* Handler for keyboard and mouse input
*/
var Input = function() {
  this.keyDowns = [];
  this.lastKeyDownTime = 0;
  this.keyDownMinInterval = 100;
  this.lastMouseClickCanvasPosition = null;
  
  /**
  * Init key and mouse listeners
  */
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
  
  /**
  * Get canvas coordinate for mouse click.
  *
  * @param {jQuery.Event} mouseEvent Event for canvas mouse click
  * @return {object} Object for canvas coordinates. Contains x and y fields.
  */
  this.getCanvasMousePosition = function(mouseEvent) {
    var rect = $("#v_canvasMap")[0].getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  };
  
  /**
  * Keyboard key is pressed. Store key press.
  *
  * @param {int} key Key code for key press
  */
  this.keyPressed = function(key) {
    this.keyDowns[key] = true;
  };
  
  /**
  * Keyboard key is released. Store key release.
  *
  * @param {int} key Key code for key release
  */
  this.keyReleased = function(key) {
    this.keyDowns[key] = false;
  };
  
  /**
  * Is player key press interval valid. Too fast input is prevented.
  *
  * @return {boolean} true if input is not too fast
  */
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
  
  /**
  * Is given key pressed down?
  *
  * @return {boolean} true if key is pressed down
  */
  this.isKeyDown = function(keyCode) {
    return this.keyDowns[keyCode];
  };
  
  /**
  * Is given key directional key?
  *
  * @param {int} key Key code
  * @return {boolean} true if key is directional key
  */
  this.isDirectionalKey = function(key) {
    return key === KEY.VK_UP || key === KEY.VK_DOWN || key === KEY.VK_LEFT || key === KEY.VK_RIGHT;
  };
  
  /**
  * Get pressed down directional key.
  *
  * @return {int} Key code for directional key. 0 if no directiona keys is pressed.
  */
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
  
  /**
  * Get directional key DIRECTION constant.
  *
  * @param {int} key Key code
  * @return {string} DIRECTION contant. null if key does not corresponse any DIRECTION.
  */
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

  /**
  * Get all currently pressed down keys.
  *
  * @return {array} Array of key codes,
  */
  this.getKeyDowns = function() {
    var result = [];

    this.keyDowns.forEach(function(value, index) {
      if (value === true) {
        result.push(index);
      };
    });

    return result;
  };
  
  /**
  * Checks if player wants to pass his turn. Either by pushing spacebar or some mouse command.
  *
  * @return {boolean} true if player wants to pass
  */
  this.isPass = function() {
    if(this.isKeyDown(KEY.VK_SPACE)){
    	return true;
    }
    
    return false;
  };
};