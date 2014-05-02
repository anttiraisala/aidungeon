var Input = function() {
  this.keyDowns = [];
  this.lastKeyDownTime = 0;
  this.keyDownMinInterval = 100;

  this.isKeyDown = function(keyCode) {
    result = 0;

    if (this.keyDowns[keyCode]) {
      result = keyCode;
    }

    return result;

  };

  this.isDirectionalPushed = function() {
    var result = 0;

    if (this.isKeyDown(KEY.VK_UP)) {
      return KEY.VK_UP;
    }

    if (this.isKeyDown(KEY.VK_DOWN)) {
      return KEY.VK_DOWN;
    }

    if (this.isKeyDown(KEY.VK_LEFT)) {
      return KEY.VK_LEFT;
    }

    if (this.isKeyDown(KEY.VK_RIGHT)) {
      return KEY.VK_RIGHT;
    }

    return result;
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