// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;

// our user controlled character object - see Player.js for more information
var thePlayer;

// create an object to hold our "world parameters" - we will send this object into our 
// OverheadWorld to tell it how our world is organized
var worldParameters = {
    tileSize: 32,
    tileFolder: 'assets/tiles',
    numTiles: 20,
    solidTiles: {
        1: true,
    },
    cropTiles: {
        10: {
            name: 'wheat'
        },
        20: true
    }
};

var canvas;

var canvasWidth = 500,
    canvasHeight = 500;


// room data - loaded in from an external file (see 'data/rooms.json')
var roomData;

var timeGate = false;
var theTime;
var tickTime = 500;

/* CONTROLS */
var interactKey = 'e',
    inventoryKey = 'i';

/* states and such */
var inventoryIsOpen = false;

// handle the tile loading and creating our player object in preload before the game can start
function preload() {

    // load in room data
    roomData = loadJSON("data/maps.json");

    // create our world
    theWorld = new OverheadWorld(worldParameters);

    // create our player
    thePlayer = new Player(100, 100, theWorld);
    
    // create game time
    let initTime = new Timeformat(0,0);
    console.log( initTime );
    theTime = new Gametime( 0, initTime );
    console.log( theTime );
}

function setup() {
    canvas = createCanvas(canvasWidth,canvasHeight);
    canvas.parent('gamepane');

    // now that everything is fully loaded send over the room data to our world object
    // also let the world know which room we should start with
    theWorld.setupRooms( roomData, "start" );
    
    setInterval( gametimeInterval, tickTime );
}

function allDone(worldData) {
    console.log("here");
}

function badStuffHappened(result) {
    console.log(result);
}

function draw() {
    theWorld.displayWorld()
    thePlayer.move();
    thePlayer.display();
    
    if ( timeGate ) {
        timeGate = false;
        if ( theTime.progressTime() ) { // progress time, hook day change events
            dayChangeEvents();
        }
    }
    text("TIME: day " + theTime.day + " " + theTime.time.toString(), 10, 10 );
}

function keyPressed() {
    if ( key == interactKey ) {
        interactionEvents();
    }
    
    if ( key == inventoryKey ) {
        inventoryEvents();
    }
}

function gametimeInterval() {
    timeGate = true;
}

function interactionEvents() {
    let interactedTile = theWorld.getTileByRowCol( thePlayer.target.y, thePlayer.target.x);
    console.log("TARGET: [" + thePlayer.target.x + "," + thePlayer.target.y + "]\nID: " + interactedTile );
    
    if ( theWorld.isCrop( interactedTile ) ) {
        let baseCropID = 0;
        if ( interactedTile % 10 ) {
            baseCropID = interactedTile - ( interactedTile % 10 );
        } else {
            baseCropID = interactedTile;
        }
        console.log("THAT'S A CROP BABEY!!!!!! Specifically: " + worldParameters.cropTiles[baseCropID].name);
        cropInteraction( thePlayer.target.x, thePlayer.target.y, baseCropID, interactedTile );
    }
}

function cropInteraction( x, y, baseCropID, stateID ) {
    let tool = thePlayer.held;
    stateID -= baseCropID;
    if ( tool == 'wateringcan' ) {
        if ( stateID < 5 ) {
            console.log("watering...");
            theWorld.tileMap[y][x] += 5;
        }
    } if ( tool == 'scythe' ) {
        theWorld.tileMap[y][x] = 0;
    }
}

function inventoryEvents() {
    if ( inventoryIsOpen ) {
        
    } else {
        
    }
}

function dayChangeEvents() {
    for ( let y = 0; y < theWorld.tileMap.length; y++ ) {
        for ( let x = 0; x < theWorld.tileMap[y].length; x++ ) {
            if ( theWorld.isCrop( theWorld.tileMap[y][x] ) ) {
                let id = theWorld.tileMap[y][x];
                let baseCropID = 0;
                if ( id % 10 ) {
                    baseCropID = id - ( id % 10 );
                } else {
                    baseCropID = id;
                }
                let stateID = id - baseCropID;
                if ( stateID >= 5 && stateID < 9 ) {
                    theWorld.tileMap[y][x] -= 4;
                } else if ( stateID == 9 ) {
                    theWorld.tileMap[y][x] -= 5;
                } else {
                    // chance that the plant dies
                }
            }
        }
    }
}