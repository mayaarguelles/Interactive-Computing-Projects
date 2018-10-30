// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

var gameState = 1;

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;

// our user controlled character object - see Player.js for more information
var thePlayer;

var inventoryDOM = document.querySelector('#inventorypane'),
    theInventory;

// create an object to hold our "world parameters" - we will send this object into our 
// OverheadWorld to tell it how our world is organized
var worldParameters = {
    tileSize: 32,
    tileFolder: 'assets/tiles',
    numTiles: 88,
    solidTiles: {
        0: true,
        1: true,
        5: true,
        20: true,
        21: true,
        22: true,
        23: true,
        24: true,
        25: true,
        26: true,
        29: true,
        42: true,
        44: true,
        45: true,
        46: true,
        47: true,
        48: true,
        49: true,
        50: true,
        51: true,
        52: true,
        53: true,
        54: true,
        55: true,
        56: true,
        57: true,
        58: true,
        59: true,
        60: true,
        61: true,
        65: true,
        66: true,
        67: true,
        68: true,
        69: true,
        70: true,
        71: true,
        72: true,
        73: true,
        74: true,
        75: true,
        76: true,
        77: true,
        78: true,
        79: true,
        81: true,
        82: true,
        87: true
    },
    cropTiles: {
        10: {
            name: 'wheat'
        },
    },
    cultivatable: {
        3: true,
        4: true
    },
    wetTiles: {
        4: true
    }
};

var canvas;

var canvasWidth = 512,
    canvasHeight = 512;


// room data - loaded in from an external file (see 'data/rooms.json')
var roomData;

var timeGate = false;
var theTime;
var tickTime = 500;

/* CONTROLS */
var interactKey = 'e',
    inventoryKey = 'i';

var hotbarKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/* states and such */
var inventoryIsOpen = false,
    saveGate = true,
    shopGate = true;

// handle the tile loading and creating our player object in preload before the game can start
function preload() {

    // load in room data
    roomData = loadJSON("data/maps.json");

    // create our world
    theWorld = new OverheadWorld(worldParameters);

    // create our player
    thePlayer = new Player(256, 256, theWorld);
    
    theInventory = new Inventory();
    
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
    if ( gameState == 1) {
        theWorld.displayWorld()
        let touched = thePlayer.move();
        if ( touched.includes( 59 ) ) {
            if ( saveGate ) {
                console.log( "SAVE THE GAME" );
                saveGate = false;
                setTimeout(function() {
                    saveGate = true;
                }, 500);
            }
        } else if ( touched.includes( 82 ) || touched.includes( 85 ) ) {
            if ( shopGate ) {
                console.log( "SHOP" );
                shopGate = false;
                setTimeout(function() {
                    shopGate = true;
                }, 500);
            }
        }
        thePlayer.display();

        if ( timeGate ) {
            timeGate = false;
            if ( theTime.progressTime() ) { // progress time, hook day change events
                dayChangeEvents();
            }
        }
        text("TIME: day " + theTime.day + " " + theTime.time.toString(), 10, 10 );
    } else if ( gameState == 2 ) {
        
    }
}

function keyPressed() {
    if ( gameState == 1 ) {
        if ( key == interactKey ) {
            interactionEvents();
        }

        if ( key == inventoryKey ) {
            inventoryEvents();
        }
        
        if ( hotbarKeys.includes( key )  ) {
            theInventory.updateHeld( key );
        }
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
    
    if ( theWorld.isCultivatable( interactedTile ) ) {
        if ( thePlayer.held.includes('seeds') ) {
            console.log("YOU GOT SEEDS BABEY!!!!!!");
            let heldExploded = thePlayer.held.split('-');
            let cropID = parseInt(heldExploded[heldExploded.length - 1]);
        
            cropPlanting( thePlayer.target.x, thePlayer.target.y, cropID);
        } else if ( thePlayer.held == 'wateringcan' ) {
            if ( !theWorld.isWet( theWorld.tileMap[ thePlayer.target.y ][ thePlayer.target.x ] ) ) {
                theWorld.tileMap[ thePlayer.target.y][ thePlayer.target.x ] = 4;
            }
        } else if ( thePlayer.held == -1 ) {
            gameState == 2;
        }
    }
    
    if ( interactedTile == 87 ) {
        giftEvents();
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
        if ( stateID < 5 ) {
            theWorld.tileMap[y][x] = 3;
        } else {
            theWorld.tileMap[y][x] = 4;
        }
    }
}

function cropPlanting( x, y, baseCropID ) {
    if ( theWorld.isWet( theWorld.tileMap[y][x] ) ) {
        console.log(baseCropID + 5);
        theWorld.tileMap[y][x] = baseCropID + 5;
    } else {
        theWorld.tileMap[y][x] = baseCropID;
    }
}

function inventoryEvents() {
    if ( inventoryIsOpen ) {
        inventoryIsOpen = false;
        inventoryDOM.classList.remove('active');
    } else {
        inventoryIsOpen = true;
        inventoryDOM.classList.add('active');
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
                    if ( Math.random() < 0.25 ) {
                        theWorld.tileMap[y][x] = 0;
                    }   
                }
            }
        }
    }
    
    // chance that you get a gift
    if ( Math.random() < 0.15 ) {
        theWorld.tileMap[3][5] = 87;
    }
}

function giftEvents() {
    theWorld.tileMap[3][5] = 60;
}


var domButtons = document.querySelectorAll('button');


/*--------------------------------*\
	 DOM SHIT
\*--------------------------------*/

function buttonSetup() {
    for (var i = 0; i < domButtons.length; i++) {
        domButtons[i].addEventListener('click', buttonHandler);
    }
}

function buttonHandler() {
    let id = this.getAttribute('id');
    console.log( id );
    switch ( id ) {
        case 'updateheld':
            debug_updateHeld();
            break;
        case 'updatetime':
            debug_updateTime();
            break;
        default:
            break;
    }
}

function debug_updateHeld() {
    thePlayer.held = document.querySelector('#playerheld').value;
    console.log("Now holding: " + thePlayer.held );
}

function debug_updateTime() {
    theTime.time.hour = document.querySelector('#gametimehour').value;
    theTime.time.minute = document.querySelector('#gametimeminute').value;
}

window.addEventListener('load', buttonSetup);

function saveGame() {
    console.log( JSON.stringify( theWorld ) );
    console.log(JSON.parse( JSON.stringify( theWorld ) ));
}