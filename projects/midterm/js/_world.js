function OverheadWorld(params) {
    // store our desired tile size
    this.tileSize = params.tileSize;

    // store the folder in which all of our tiles are stored
    this.tileFolder = params.tileFolder;

    // store how many tiles we are working with
    this.numTiles = params.numTiles;

    // store an object that defines which tiles are solid
    this.solidTiles = params.solidTiles;
    
    this.cropTiles = params.cropTiles;
    
    this.cultivatableTiles = params.cultivatable;
    
    this.wetTiles = params.wetTiles;

    // an array to hold all tile graphics
    this.tileLibrary = [];
    
    this.offsetX = 0;
    this.offsetY = 0;

    // load in all tile graphics
    for (var i = 0; i < this.numTiles; i++) {
        var tempTile = loadImage(this.tileFolder + "/" + i + ".png");
        this.tileLibrary.push(tempTile);
    }

    // displayTile: draws a single tile at a specified location
    this.displayTile = function(id, x, y) {
        image(this.tileLibrary[id], x, y);
    }

    // setup rooms
    this.setupRooms = function(data, startRoom) {
        // store room data (an object)
        this.roomData = data;

        // store our current room
        this.roomCurrent = startRoom;

        // extract the level definition for our starting room
        this.tileMap = this.roomData[this.roomCurrent].level;
    }

    // displayWorld: displays the current world
    this.displayWorld = function() {
        push();
        translate(this.offsetX, this.offsetY);
        
        for (var row = 0; row < this.tileMap.length; row += 1) {
            for (var col = 0; col < this.tileMap[row].length; col += 1) {
                image(this.tileLibrary[ this.tileMap[row][col] ], col*this.tileSize, row*this.tileSize, this.tileSize, this.tileSize);
            }
        }
        
        pop();
    }

    // get a tile based on a screen x,y position
    this.getTile = function(x, y, returnRowCol = false) {
        // convert the x & y position into a grid position
        var col = Math.floor(x/this.tileSize);
        var row = Math.floor(y/this.tileSize);
        
        if ( returnRowCol ) {
            return {
                x: col,
                y: row
            }
        }

        // if the computed position is not in the array we should determine if this movement
        // requires a room change - if so we need to notifiy the player
        if (row < 0 && this.roomData[this.roomCurrent].up != "none") {
            return "roomChange";
        }
        else if (row >= this.tileMap.length && this.roomData[this.roomCurrent].down != "none") {
            return "roomChange";
        }
        else if (col < 0 && this.roomData[this.roomCurrent].left != "none") {
            return "roomChange";
        }
        else if (col >= this.tileMap[row].length && this.roomData[this.roomCurrent].right != "none") {
            return "roomChange";
        }

        // otherwise we hit and edge but there is no room to move into - assume the edge is solid
        else if (row < 0 || row >= this.tileMap.length || col < 0 || col >= this.tileMap[row].length) {
            return -1;
        }

        // get the tile from our map
        return this.tileMap[row][col];
    }
    
    this.getTileByRowCol = function(row, col) {
        return this.tileMap[row][col];
    }

    // change rooms
    this.changeRoom = function(direction) {
        // store our current room
        this.roomCurrent = this.roomData[this.roomCurrent][direction];

        // extract the level definition for our starting room
        this.tileMap = this.roomData[this.roomCurrent].level;
    }

    // see if this tile is solid
    this.isTileSolid = function(id) {
        if (id in this.solidTiles || id == -1) {
            return true;
        }

        // otherwise return false
        return false;
    }
    
    this.isCrop = function(id) {
        let baseCropID = 0;
        if ( id % 10 != 0 ) {
            baseCropID = id - ( id % 10 );
        } else {
            baseCropID = id;
        }
        
        //console.log(baseCropID);
        if ( baseCropID in this.cropTiles ) {
            return true;
        }
        
        return false;
    }
    
    this.isCultivatable = function(id) {
        if ( id in this.cultivatableTiles ) {
            return true;
        }
        
        return false;
    }
    
    this.isWet = function(id) {
        if ( id in this.wetTiles ) {
            return true;
        }
        
        return false;
    }
    
    // move the world
    this.moveRight = function(val) {
        this.offsetX += val;
    }
    this.moveLeft = function(val) {
        this.offsetX -= val;
    }
    this.moveUp = function(val) {
        this.offsetY -= val;
    }
    this.moveDown = function(val) {
        this.offsetY += val;
    }
}