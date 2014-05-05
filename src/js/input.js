var Input = function() {
  this.keyDowns = [];
  this.lastKeyDownTime = 0;
  this.keyDownMinInterval = 100;
  
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
    var currentTime = $.now();
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