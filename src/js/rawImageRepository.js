var RawImageRepository = function() {
  var sourcePaths = [];
  var rawImages = [];
  
  this.getRawImages = function(){
    return rawImages;
  };
  
  var imageIndex = 0;
  
  var _readyCallBack;
  
  this.addSourcePath = function(path) {
    sourcePaths.push(path);
  };
    
  // Loads image files, and after the last one, calls call-back-function ( readyCallback )
  this.loadRawImages = function(readyCallback) {
    _readyCallBack = readyCallback;
    //alert("loadRawImages" + sourcePaths);
    this.loadSingleRawImage();
  };
  
  this.loadSingleRawImage = function() {
    //alert("loadSingleRawImage");
    
    var src = sourcePaths[imageIndex];
    //alert(src);
    var image = new Image();
    image.onload = function() {
    
      rawImages[imageIndex] = this;
      
      imageIndex++;
      
      if(imageIndex >= sourcePaths.length)
        _readyCallBack();
      else
        rawImageRepository.loadSingleRawImage();
    };
    
    // Load image by setting its src-property. "onload" will be called after load is complete.
    image.src = src;
  };
};