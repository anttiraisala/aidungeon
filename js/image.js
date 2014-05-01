// from:
// https://github.com/straker/galaxian-canvas-game/blob/master/part1/space_shooter_part_one.js

function loadSprite(src) {
	var deferred = $.Deferred();
	var sprite = new Image();
	sprite.onload = function() {
		deferred.resolve();
	};
	sprite.src = src;
	return deferred.promise();
};

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var rawImageRepository = new function() {
	
	var URL = $(location).attr('href');
	var PATH = $(location).attr('pathname');
	
	alert("rawImageRepository");
	
	var totalImageCount=1;
	var currentImageCount=0;
	
	// Define images
	this.empty = null;
	this.background = new Image();
	
	this.image1 = new Image();
	
	var src = "../imgs/tileSets/ultima_v_5_warriors_of_destiny_tileset.PNG";
	this.image1.onload = function() {
	alert("onload:" + src);
	currentImageCount++;
	};
	this.image1.src = src;
	//alert("W=" + this.image1.width + " H=" + this.image1.height);
	
	// Set images src
	this.background.src = "imgs/bg.png";
	
	var loaders = [];
	loaders.push(loadSprite("../imgs/tileSets/ultima_v_5_warriors_of_destiny_tileset.PNG"));
	loaders.push(loadSprite("../imgs/tileSets/nethack.gif"));
	loaders.push(loadSprite("../imgs/tileSets/mountain_landscape_23.png"));
	loaders.push(loadSprite("../imgs/tileSets/Ultima_4_-_Tiles_-_VGA.png"));
	loaders.push(loadSprite("../imgs/tileSets/Portraits.gif"));
	$.when.apply(null, loaders).done(function() {
		// callback when everything was loaded
		allImagesAreLoaded();
	});
};

var imageCell = function(pRawImageSource, pStartX, pStartY, pWidth, pHeight) {

	alert("imageCell");

	var src = pRawImageSource;
	var startX = pStartX;
	var startY = pStartY;
	var width = pWidth;
	var height = pHeight;
};

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 */
function Drawable() {
	this.init = function(x, y) {
		// Defualt variables
		this.x = x;
		this.y = y;
	};

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
}