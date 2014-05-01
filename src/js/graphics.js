/**
 * @author Antti
 */



imageCell = function(pRawImageSource, pStartX, pStartY, pWidth, pHeight, pHotSpotX, pHotSpotY) {
	// Default values
	this.startX = 0;
	this.startY = 0;
	this.width = 0;
	this.height = 0;
	this.hotSpotX = 0;
	this.hotSpotY = 0;

	// Parameter values
	this.rawImageSource = pRawImageSource;
	this.startX = pStartX;
	this.startY = pStartY;
	this.width = pWidth;
	this.height = pHeight;
	//
	if (pHotSpotX !== undefined) {
		this.hotSpotX = pHotSpotX;
	} else {
		this.hotSpotX = 0;
	}
	//
	if (pHotSpotY !== undefined) {
		this.hotSpotY = pHotSpotY;
	} else {
		this.hotSpotY = 0;
	}

	//alert("pRawImageSource.src=" + pRawImageSource.src + "\n" + "pStartX=" + pStartX + "\n" + "pStartY=" + pStartY + "\n" + "pWidth=" + pWidth + "\n" + "pHeight=" + pHeight + "\n" + "pHotSpotX=" + pHotSpotX + "\n" + "pHotSpotY=" + pHotSpotY + "\n\n" + "rawImageSource.src=" + this.rawImageSource.src + "\n" + "startX=" + this.startX + "\n" + "startY=" + this.startY + "\n" + "width=" + this.width + "\n" + "height=" + this.height + "\n" + "hotSpotX=" + this.hotSpotX + "\n" + "hotSpotY=" + this.hotSpotY);
};

imageCellLoop = function() {

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
		//console.log('getCurrentFrame=' + this.currentFrameIndex);
		return this.currentFrameIndex;
	};

	this.advanceTime = function() {
		this.currentTime += global.dAnimateStartTime;

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

rawImageRepository = new function() {

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



