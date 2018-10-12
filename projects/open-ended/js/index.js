/*--------------------------------*\
	 GLOBAL VARIABLES
\*--------------------------------*/

/* canvas config */
var canvas;
var canvasWidth = 480;
var canvasHeight = 480;

/* game config */
var globalState = 1;
var cheatMode = false;

var bgMusic;

/* tileset */
var tileSize = 24;

var tilesX = Math.ceil(canvasWidth / tileSize),
    tilesY = Math.ceil(canvasHeight / tileSize);

var tileset = [];

for ( var y = 0; y < tilesY; y++ ) {
    tileset[y] = [];
    for ( var x = 0; x < tilesX; x++ ) {
        tileset[y][x] = new Tile(Math.floor( Math.random() * 1.2 ), x, y);
    }
}

console.log( tileset );


/* theme */
var theme = 'bw',
    darkColor = '#000000',
    lightColor = '#ffffff';

/* player config */
var playerChar = new CharacterObj();

var charLeft,
    charRight,
    charDown,
    charUp;


/* cheat panel */
var domButtons = document.querySelectorAll('.cheat-panel button');


/*--------------------------------*\
	 PROCESSING
\*--------------------------------*/
function preload() {
    charLeft = loadImage("img/left.gif");
    charRight = loadImage("img/right.gif");
    charDown = loadImage("img/down.gif");
    charUp = loadImage("img/up.gif");
    
    bgMusic = loadSound("audio/music.mp3");
}

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('game-panel');
    
    background( darkColor );
    fill( lightColor );
    stroke( lightColor );
    bgMusic.play();
}

function draw() {
    
    sceneHandler( globalState );
    
    cheatSequence();
}

var curKeys = [];

function keyPressed() {
    curKeys.push( key );
    //console.log(curKeys);
}

function keyReleased() {
    for (var i = 0; i < curKeys.length; i++) {
        if ( curKeys[i] == key ) {
            curKeys.splice(i, 1);
        }
    }
    //console.log(curKeys);
}

function sceneHandler( globalState ) {
    switch ( globalState ) {
        case 0:
            scene_titleScreen();
            break;
        case 1:
            scene_game();
            break;
        case -1:
            scene_gameOver();
            break;
        default:
            scene_error();
            break;
    }
}

function scene_titleScreen() {
    background( darkColor );
    fill( lightColor );
    stroke( lightColor );
    textA
    text('Alone',40,40);
}

function scene_game() {
    background( darkColor );
    fill( lightColor );
    stroke( lightColor );
    
    // text('game', 40, 40);
    
    for ( var y = 0; y < tilesY; y++ ) {
        for ( var x = 0; x < tilesX; x++ ) {
            tileset[y][x].draw();
            tileset[y][x].collisionTest();
        }
    }
    
    
    playerChar.draw();
    playerChar.updatePos();
}

function scene_gameOver() {
    
}

function scene_error() {
    background('#000000');
    fill('#ffffff');
    stroke('#ffffff');
}

function applyTheme() {
    
}


/*--------------------------------*\
	 PLAYER
\*--------------------------------*/

function CharacterObj() {
    this.posX = canvasWidth / 2;
    this.posY = canvasHeight / 2;
    this.speed = 4;
    this.width = 17;
    this.height = 33;
    this.sprite = charDown;
    
    this.draw = function() {        
        //console.log( 'X: ' + this.posX + ' Y:' + this.posY);
        
        //rect(this.posX, this.posY, this.width, this.height);
        image( charDown, this.posX, this.posY );
    }
    
    this.updatePos = function() {
        if ( keyIsPressed ) {
            if ( curKeys.includes('w') ) {
                this.posY = constrain(this.posY - this.speed, 0, canvasHeight - this.height);
                this.sprite = charUp;
            } if ( curKeys.includes('s') ) {
                this.posY = constrain(this.posY + this.speed, 0, canvasHeight - this.height);
                this.sprite = charDown;
            } if ( curKeys.includes('a') ) {
                this.posX = constrain(this.posX - this.speed, 0, canvasWidth - this.width);
                this.sprite = charLeft;
            } if ( curKeys.includes('d') ) {
                this.posX = constrain(this.posX + this.speed, 0, canvasWidth - this.width);
                this.sprite = charRight;
            }
        }
    }
}

/*--------------------------------*\
	 TILES
\*--------------------------------*/

function Tile( id, xInd, yInd ) {
    this.id = id;
    this.posX = xInd * tileSize;
    this.posY = yInd * tileSize;
    this.centerX = this.posX + (tileSize / 2);
    this.centerY = this.posY + (tileSize / 2);
    
    this.draw = function() {
        switch ( this.id ) {
            case 0:
                break;
            case 1:
                if ( cheatMode ) {
                    rect(this.posX, this.posY, tileSize, tileSize);
                }
                break;
            default:
                break;
        }
    }
    
    this.collisionTest = function() {
        switch ( this.id ) {
            case 0:
                break;
            case 1:
                if ( playerChar.posX + playerChar.width > this.posX && playerChar.posX < this.posX + tileSize && playerChar.posY + playerChar.height > this.posY && playerChar.posY  < this.posY + tileSize ) {
                    let diffX = this.centerX - (playerChar.posX + ( playerChar.width / 2 ) );
                    let diffY = this.centerY - (playerChar.posY + ( playerChar.height / 2 ) );
                    
                    // console.log( 'X: ' + diffX + ' Y: ' + diffY);

                    if ( Math.abs( diffX ) > Math.abs( diffY ) ) {
                        if ( diffX > 0 ) {
                            playerChar.posX = this.posX - playerChar.width;
                        } else {
                            playerChar.posX = this.posX + tileSize;
                        }
                    } else {
                        if ( diffY > 0 ) {
                            playerChar.posY = this.posY - playerChar.height;
                        } else {
                            playerChar.posY = this.posY + tileSize;
                        }
                    }
                }
                
                break;
            default:
                break;
        }
    }
}

function posterize( test, min, max ) {
    let mid = (max + min) / 2;
    if ( test <= mid ) {
        return min;
    }
    return max;
}

/*--------------------------------*\
	 CHEATS
\*--------------------------------*/

var cheatSteps = [
    false, // up
    false, // up
    false, // down
    false, // down
    false, // left
    false, // right
    false, // left
    false, // right
    false, // b
    false, // a
    false  // enter
];

var pressGate = true;


function cheatSequence() {
    if ( keyIsPressed ) {
        //console.log( key );
        if ( key == 'ArrowUp' && !cheatSteps[0] && pressGate ) {
            cheatSteps[0] = true;
            //console.log('step 0');
            pressGate = false;
        } else if ( key == 'ArrowUp' && !cheatSteps[1] && checkSequenceUpTo(1) && pressGate ) {
            cheatSteps[1] = true;
            //console.log('step 1');
            pressGate = false;
        } else if ( key == 'ArrowDown' && !cheatSteps[2] && checkSequenceUpTo(2) && pressGate ) {
            cheatSteps[2] = true;
            //console.log('step 2');
            pressGate = false;
        } else if ( key == 'ArrowDown' && !cheatSteps[3] && checkSequenceUpTo(3) && pressGate ) {
            cheatSteps[3] = true;
            //console.log('step 3');
            pressGate = false;
        } else if ( key == 'ArrowLeft' && !cheatSteps[4] && checkSequenceUpTo(4) && pressGate ) {
            cheatSteps[4] = true;
            //console.log('step 4');
            pressGate = false;
        } else if ( key == 'ArrowRight' && !cheatSteps[5] && checkSequenceUpTo(5) && pressGate ) {
            cheatSteps[5] = true;
            //console.log('step 5');
            pressGate = false;
        } else if ( key == 'ArrowLeft' && !cheatSteps[6] && checkSequenceUpTo(6) && pressGate ) {
            cheatSteps[6] = true;
            //console.log('step 6');
            pressGate = false;
        } else if ( key == 'ArrowRight' && !cheatSteps[7] && checkSequenceUpTo(7) && pressGate ) {
            cheatSteps[7] = true;
            //console.log('step 7');
            pressGate = false;
        } else if ( key == 'a' && !cheatSteps[8] && checkSequenceUpTo(8) && pressGate ) {
            cheatSteps[8] = true;
            //console.log('step 8');
            pressGate = false;
        } else if ( key == 'b' && !cheatSteps[9] && checkSequenceUpTo(9) && pressGate ) {
            cheatSteps[9] = true;
            //console.log('step 9');
            pressGate = false;
        } else if ( keyCode == ENTER && !cheatSteps[10] && checkSequenceUpTo(10) && pressGate ) {
            cheatSteps[10] = true;
            //console.log('step 10');
            pressGate = false;
            resetSequence();
            triggerCheatPanel();
        } else if ( pressGate ) {
            //console.log('reset');
            resetSequence();
            pressGate = false;
        }
    } else {
        pressGate = true;
    }
}

function checkSequenceUpTo( index ) {
    for ( var i = 0; i < index; i++ ) {
        if ( !cheatSteps[i] ) {
            return false;
        }
    } 
    
    return true;
}

function resetSequence() {
    for ( var i = 0; i < cheatSteps.length; i++ ) {
        cheatSteps[i] = false;
    } 
}

function triggerCheatPanel() {
    let cheatPanel = document.querySelector('.cheat-panel');
    cheatPanel.classList.add('active');
}



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
    switch ( id ) {
        case 'action':
            cheatMode = true;
            break;
        default:
            break;
    }
}

window.addEventListener('load', buttonSetup);