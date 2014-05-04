var Input = function() {
  this.keyDowns = [];
  this.keyQueue = [];
  this.lastKeyDownTime = 0;
  this.keyDownMinInterval = 100;
  
  this.keyPressed = function(key) {
    this.keyDowns[key] = true;
    this.keyQueue.push(key);
  };
  
  this.keyReleased = function(key) {
    this.keyDowns[key] = false;
  };
  
  this.isPlayerInputQueueEmpty = function() {
    return this.keyQueue.length === 0;
  };
  
  this.peekNextKeyFromQueue = function() {
    return this.keyQueue.legth > 0 ? this.keyQueue[0] : null;
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