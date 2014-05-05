/**
* Object to handle single image part in tileset.
*/
var ImageCell = function(pRawImageSource, pStartX, pStartY, pWidth, pHeight, pHotSpotX, pHotSpotY) {
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