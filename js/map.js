var Map = function() {
  this.tiles = {};
  this.width = 30;
  this.height = 30;
  
  this.init = function() {
    var mapData = [];
    for (var x = 0; x < this.width; x++) {
      mapData[x] = new Array(this.height);
      for (var y = 0; y < this.height; y++) {
        mapData[x][y] = 1;
      }
    }

    // House
    mapData[6][3] = 10;
    mapData[6][2] = 10;
    mapData[6][1] = 11;
    // Secret Door !
    mapData[6][0] = 10;
    mapData[7][0] = 10;
    mapData[8][0] = 10;
    mapData[9][0] = 10;
    mapData[9][1] = 10;
    mapData[9][2] = 10;
    mapData[9][3] = 10;
    mapData[8][3] = 10;
    //
    // Floor
    mapData[7][3] = 12;
    mapData[7][2] = 12;
    mapData[7][1] = 12;
    mapData[8][2] = 12;
    mapData[8][1] = 12;

    // Deeper water
    mapData[0][8] = 20;
    mapData[0][7] = 20;
    mapData[0][6] = 20;
    mapData[0][5] = 20;
    mapData[1][8] = 20;
    mapData[1][7] = 20;
    mapData[1][6] = 20;
    mapData[1][5] = 20;
    mapData[1][4] = 20;
    mapData[2][7] = 20;
    mapData[2][6] = 20;

    // Shallow water
    mapData[2][5] = 21;
    mapData[2][4] = 21;
    mapData[3][5] = 21;
    mapData[3][4] = 21;
    mapData[3][3] = 21;

    // Dense woods
    mapData[7][8] = 2;

    // Smaller woods
    mapData[6][7] = 3;
    mapData[7][7] = 3;

    // Low Mountains
    mapData[1][3] = 60;
    mapData[0][2] = 60;
    mapData[3][2] = 60;
    mapData[0][1] = 60;
    mapData[3][1] = 60;
    mapData[1][0] = 60;
    mapData[2][0] = 60;

    // Medium Mountains
    mapData[1][2] = 61;
    mapData[2][2] = 61;
    mapData[2][1] = 61;

    // High Mountains
    mapData[1][1] = 62;

    // Marsh
    mapData[2][3] = 59;

    // Strange Worm
    mapData[0][4] = 200;

    //console.log('mapData=' + JSON.stringify(mapData, null, 4));

    this.tiles = mapData;

    //console.log('worldMap.tiles=' + JSON.stringify(worldMap.tiles, null, 4));
  };
};