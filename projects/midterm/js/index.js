// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

var gameState = 0;

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;

// our user controlled character object - see Player.js for more information
var thePlayer;

var inventoryDOM = document.querySelector('#inventorypane'),
    toolbarDOM = document.querySelector('#toolbar'),
    theInventory;

var startScreen = document.querySelector('#startscreen');

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
        33: true,
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

var itemsLibrary;

var money = 0;

var parsedSpeech = "",
    speechFlag = false,
    speechTargetX,
    speechTargetY,
    responseJSON,
    interpretedFlag = false;

var sadReacts = [],
    neutralReacts = [],
    happyReacts = [],
    selectedReact = 0,
    reactFrame = 0,
    reacting = false;

// handle the tile loading and creating our player object in preload before the game can start
function preload() {

    // load in room data
    roomData = loadJSON("data/maps.json");
    
    itemsLibrary = loadJSON("data/items.json");

    // create our world
    theWorld = new OverheadWorld(worldParameters);

    // create our player
    thePlayer = new Player(256, 256, theWorld);
    
    // create game time
    let initTime = new Timeformat(0,0);
    console.log( initTime );
    theTime = new Gametime( 0, initTime );
    console.log( theTime );
    
    sadReacts = [ thePlayer.loadFrames( 'assets/effects/angry' ),
                  thePlayer.loadFrames( 'assets/effects/heartbreak' ),
                  thePlayer.loadFrames( 'assets/effects/scribble' ) ];
    neutralReacts = [ thePlayer.loadFrames( 'assets/effects/speaking' ) ];
    happyReacts = [ thePlayer.loadFrames( 'assets/effects/eyes' ),
                  thePlayer.loadFrames( 'assets/effects/sparkle' ),
                  thePlayer.loadFrames( 'assets/effects/music' ) ];
    selectedReact = neutralReacts[0];
}

function setup() {
    canvas = createCanvas(canvasWidth,canvasHeight);
    canvas.parent('gamepane');

    // now that everything is fully loaded send over the room data to our world object
    // also let the world know which room we should start with
    theWorld.setupRooms( roomData, "start" );
    
    theInventory = new Inventory( itemsLibrary );
    grantStarterKit();
    
    setInterval( gametimeInterval, tickTime );
    
    // create speech to text object
    myRec = new p5.SpeechRec();

    // set up our recorder to constantly monitor the incoming audio stream
    myRec.continuous = true; // do continuous recognition

    // allow partial results - this will detect words as they are said and will
    // call the parse function as soon as a word is decoded
    // when a pause in conversation occurs the entire string will be sent
    // to the parse function
    //myRec.interimResults = true;

    // define our parse function (called every time a word/phrase is detected)
    myRec.onResult = parseResult;
}

function grantStarterKit() {
    let startercan = copyItem("wateringcan");
    let starterscythe = copyItem("scythe");
    let starterseeds = copyItem("wheatseeds");
    
    startercan.quantity = 1;
    starterscythe.quantity = 1;
    starterseeds.quantity = 12;
    
    theInventory.addItem( startercan );
    theInventory.addItem( starterscythe );
    theInventory.addItem( starterseeds );
    theInventory.addItem( starterseeds );
}

function allDone(worldData) {
    console.log("here");
}

function badStuffHappened(result) {
    console.log(result);
}

function draw() {
    if ( gameState == 0 ) {
        background('#eee');
        
    } else if ( gameState == 1) {
        theWorld.displayWorld()
        let touched = thePlayer.move();
        if ( touched.includes( 59 ) ) {
            if ( saveGate ) {
                savePrompt( true );
                saveGate = false;
                setTimeout(function() {
                    saveGate = true;
                }, 1000);
            }
        }
        thePlayer.display();

        if ( timeGate ) {
            timeGate = false;
            if ( theTime.progressTime() ) { // progress time, hook day change events
                dayChangeEvents();
            }
        }
        
        if ( speechFlag ) {
            console.log( "PARSED: " + parsedSpeech );
            speechFlag = false;
            evaluatePhrase( parsedSpeech );
            thePlayer.speaking = false;
        }
        
        if ( interpretedFlag ) {
            interpretedFlag = false;
            if ( responseJSON.label == 'neg' ) { // if something negative was said
                let reactInd = Math.floor(Math.random() * sadReacts.length);
                selectedReact = sadReacts[reactInd];
                let deathChance = Math.random();
                console.log ( "deathgen: "+ deathChance );
                if ( deathChance < 0.05) {
                    theWorld.tileMap[speechTargetY][speechTargetX] = 3;
                }
            } else if ( responseJSON.label == 'neutral' ) { // if something neutral was said
                let reactInd = Math.floor(Math.random() * neutralReacts.length);
                selectedReact = neutralReacts[reactInd];
            } else { // if something positive was said
                let reactInd = Math.floor(Math.random() * happyReacts.length);
                selectedReact = happyReacts[reactInd];
                let growthChance = Math.random();
                console.log( "growthgen: " + growthChance );
                if ( growthChance < 0.15 ) {
                    let state = theWorld.tileMap[speechTargetY][speechTargetX] % 5;
                    if ( state != 4 ) {
                        theWorld.tileMap[speechTargetY][speechTargetX] += 1;
                    }
                }
            }
            
            let reactInterval = setInterval(function() {
                reacting = true;
                reactFrame++;
            }, 300);
            
            setTimeout(function() {
                reacting = false;
                clearInterval( reactInterval );
            }, 1200);
        }
        
        if ( reacting ) {
            image( selectedReact[reactFrame % 3], speechTargetX * 32, speechTargetY * 32 - 32 );
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
            thePlayer.held = theInventory.updateHeld( key );
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
            
            let cur = theInventory.cur - 1;
            if ( cur == -1 ) {
                cur = 9;
            }
            
            theInventory.items[theInventory.toolbar[ cur ].index].quantity--;
            theInventory.displayInventory();
            theInventory.updateToolbar();
            
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
    
    if ( interactedTile == 81 || interactedTile == 78 ) {
        if ( thePlayer.held == 'wheat' ) { // need to program to be flexible for other crops!
            let cur = theInventory.cur - 1;
            if ( cur == -1 ) {
                cur = 9;
            }
            
            console.log( "cur: " + cur );
            
            let index = theInventory.toolbar[ cur ].index;
            
            console.log( "index: " + index );
            
            money += theInventory.sell( index, cur );
            console.log( money );
            theInventory.displayInventory();
            theInventory.updateToolbar();
            
        }
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
        
        if ( stateID == 4 || stateID == 9 ) {
            let crop = copyItem( baseCropID );
            crop.quantity = 1;
            theInventory.addItem( crop );
        }
    } if ( tool == -1 ) {
        thePlayer.speaking = true;
        let speakInterval = setInterval(function() {
            thePlayer.currentSpeaking++;
        }, 300);
        
        // start the recording engine
        speechTargetX = x;
        speechTargetY = y;
        myRec.start();
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
                        theWorld.tileMap[y][x] = 3;
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
    let giftedSeeds = Math.ceil( Math.random() * 12);
    let seedsGift = copyItem("wheatseeds");
    seedsGift.quantity = giftedSeeds;
    console.log( seedsGift );
    theInventory.addItem( seedsGift );
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
        case 'savegame':
            saveGame();
            break;
        case 'closesave':
            savePrompt( false );
            break;
        case 'newgame':
            startScreen.classList.remove('active');
            toolbarDOM.classList.add('active');
            gameState = 1;
            break;
        case 'loadgame':
            startScreen.classList.remove('active');
            toolbarDOM.classList.add('active');
            loadGame();
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

var savePane = document.querySelector('#savepane');

function savePrompt( opening ) {
    if ( opening ) {
        console.log('opening');
        savePane.classList.add('active');
    } else {
        savePane.classList.remove('active');
    }
}

function saveGame() {
    let worldString = JSON.stringify( theWorld.tileMap );
    let inventoryString = JSON.stringify( theInventory );
    let moneyString = money;
    let dayString = theTime.day;
    let dateObj = new Date();
    let dateString = dateObj.toDateString();
    
    setCookie("world", worldString, 365 * 5);
    console.log( document.cookie );
    setCookie("inventory", inventoryString, 365 * 5);
    console.log( document.cookie );
    setCookie("money", moneyString, 365 * 5);
    console.log( document.cookie );
    setCookie("day", dayString);
    setCookie("date", dateString);
    
    
    console.log( document.cookie );
}

function loadGame() {
    let worldSave = JSON.parse( getCookie("world") );
    let inventorySave = JSON.parse( getCookie("inventory") );
    let moneySave = getCookie("money");
    let daySave = getCookie("day");
    let dateSave = new Date(getCookie("date"));
    
    console.log("LOADING...");
    console.log( worldSave );
    console.log( inventorySave );
    console.log( moneySave );
    
    if ( worldSave.length > 1 ) {
        theInventory.cur = inventorySave.cur;
        theInventory.items = inventorySave.items;
        theInventory.toolbar = inventorySave.toolbar;

        theInventory.displayInventory();
        theInventory.updateToolbar();

        theWorld.tileMap = worldSave;

        money = moneySave;
        
        theTime.day = daySave;
        
        console.log( dateSave );
        console.log ( new Date() );
        
        let daysToSim = msToDays( new Date() - dateSave );
        
        console.log("Days missed since last save: " + daysToSim );
        
        for ( let i = 0; i < daysToSim; i++ ) {
            theTime.day++;
            dayChangeEvents();
        }
        
    }
    
    gameState = 1;
}

function msToDays( ms ) {
    let seconds = parseInt( Math.floor( ms / 1000 ) );
    let minutes = parseInt( Math.floor( seconds / 60 ) );
    let hours = parseInt( Math.floor( minutes / 60 ) );
    let days = parseInt( Math.floor( hours / 24 ) );
    
    return days;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// called every time a word/phrase is detected
function parseResult() {
  // myRec.resultString is the current result
  //text(myRec.resultString, 25, 25);
    console.log(myRec.resultString);
    parsedSpeech = myRec.resultString;
    speechFlag = true;
//		var mostrecentword = myRec.resultString.split(' ').pop();
}

function evaluatePhrase( phrase ) {
    console.log( phrase );
    
    var xhttp = new XMLHttpRequest()
    
    phrase = encodeURIComponent( phrase );

    // AJAX THAT SHYT
    xhttp.open("GET", "speech-interpretation/request.php?text=" + phrase  , true);
    
    console.log("request.php?text=" + phrase );
    
    xhttp.onreadystatechange = function() {
        if ( this.readyState == 4 && this.status == 200 ) { // on success
            console.log( JSON.parse( this.response ) );
            responseJSON = JSON.parse( this.responseText );
        } else if ( this.status == 503 ) {
            responseJSON =  {
                label: 'Exceeded daily request limit.'
            };
        } else {
            responseJSON = {
                label: 'Nothing happened'
            }
        }
        
        interpretedFlag = true;
    }
    
    console.log( 'loading...' );
    
    xhttp.send();
}

// for debug
function giveGift() {
    theWorld.tileMap[3][5] = 87;
}

function copyItem( name ) {
    return JSON.parse( JSON.stringify( itemsLibrary[name] ) );
}