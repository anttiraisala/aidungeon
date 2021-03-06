/**
* Loops tileset image parts to create animation.
*/
var ImageCellLoop = function() {

  this.sourceImageCells = [];
  this.frameDelays = [];

  this.currentFrameIndex = 0;
  this.currentTime = 0;

  this.addFrame = function(sourceImageCell, frameDelay) {
    //alert("addFrame()");
    this.sourceImageCells.push(sourceImageCell);
    this.frameDelays.push(frameDelay);
  };
  
  this.getCurrentFrame = function(){
    return this.sourceImageCells[this.currentFrameIndex];
  };
  
  this.getCurrentFrameIndex = function(){
    return this.currentFrameIndex;
  };

  this.advanceTime = function(dAnimateStartTime) {
    this.currentTime += dAnimateStartTime;

    if (this.currentTime >= this.frameDelays[this.currentFrameIndex]) {
      this.currentTime = 0;

      this.currentFrameIndex++;
      if (this.currentFrameIndex >= this.sourceImageCells.length) {
        this.currentFrameIndex = 0;
      }
      
      return true;
    }
    
    return false;
  };
};