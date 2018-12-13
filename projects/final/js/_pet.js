const moodboard = {
    0: 'happy',
    1: 'hungry',
    2: 'sad',
    3: 'hungry and sad',
    4: 'tired',
    5: 'needs to pee',
}

const stateBoard = {
    0: 'idle',
    1: 'sleeping',
    2: 'peeing',
    3: 'dancing',
    4: 'dead',
    5: 'walking'
}

const songs = [
    'happy.mp3',
    'happy2.mp3',
    'hungry.mp3',
    'pee.mp3',
    'sad.mp3',
    'sadhungry.mp3',
    'tired.mp3'
]

const songChoices = {
    0: [0, 1],
    1: [2],
    2: [4],
    3: [5],
    4: [6],
    5: [3],
}

// organized by state -> mood -> sprite ID
const spriteBoard = {
    0: {
        0: [0],
        1: [1],
        2: [2],
        3: [3],
        4: [4],
        5: [5]
    },
    1: {
        0: [6],
        1: [6],
        2: [6],
        3: [6],
        4: [6],
        5: [6]
    },
    2: {
        0: [7],
        1: [7],
        2: [7],
        3: [7],
        4: [7],
        5: [7]
    },
    3: {
        0: [8,9],
        1: [8,9],
        2: [8,9],
        3: [8,9],
        4: [8,9],
        5: [8,9]
    },
    4: {
        0: [10],
        1: [10],
        2: [10],
        3: [10],
        4: [10],
        5: [10]
    },
    5: {
        0: [11,12,13,14],
        1: [11,12,13,14],
        2: [11,12,13,14],
        3: [11,12,13,14],
        4: [11,12,13,14],
        5: [11,12,13,14]
    }
}

class Pet {
    constructor(name) {
        this.name = name;
        
        this.width = 128;
        this.height = 128;
        
        this.happiness = 100;
        this.hunger = 100;
        this.mood = 0;
        this.age = 0;
        this.bladder = 100;
        this.energy = 100;
        
        this.state = 0;
        this.room = 0;
        
        this.posX = 64;
        this.moveToX = this.posX;
        this.posY = 128;
        this.walkSpeed = 1;
        
        this.idleFlag = true;
        
        /*
         * tick stuff
         */
        this.happyTick = 1;
        this.hungerTick = 1;
        this.bladderTick = 1;
        this.energyTick = 1;
        this.tickLength = 1000;
        
        
        this.numSprites = 15;
        this.tileLibrary = [];
        this.numSongs = 7;
        this.songLibrary = [];
        
        this.gotocallback = function() {
            
        }
        
        for (let i = 0; i < this.numSprites; i++) {
            let tempTile = loadImage( "img/" + i + ".png");
            this.tileLibrary.push(tempTile);
        }
        
        for (let i = 0; i < this.numSongs; i++ ) {
            let tempSong = loadSound( 'sound/' + songs[i] );
            this.songLibrary.push(tempSong);
        }
        
        this.curSong = this.songLibrary[0];
        this.playing = false;
        
        this.curSprite = this.tileLibrary[0];
        this.curFrame = 0;
        
    }
    
    update() {
        //console.log("Updating...");
        
        if ( this.state == 1 ) {
            if ( this.energy == 100 ) {
                this.state = 0;
            } else {
                this.energy = constrain( this.energy + (this.energyTick * 8), 0, 100);
            }
        } else {
            this.energy = constrain( this.energy - this.energyTick, 0, 100);
        }
        
        if ( this.state == 2 ) {
            if ( this.bladder == 100 ) {
                this.state = 0;
            } else {
                this.bladder = constrain( this.bladder + (this.bladderTick * 10), 0, 100 );
            }
        } else {
            this.bladder = constrain( this.bladder - this.bladderTick, 0, 100 );
        }
        
        if ( this.state == 3 ) {
            this.happiness = constrain(this.happiness + (this.happyTick * 4), 0, 100);
        } else {
            this.happiness = constrain(this.happiness - this.happyTick, 0, 100);
        }
        
        
        this.hunger = constrain(this.hunger - this.hungerTick, 0, 100);
        
        
        /* Low motive penalties */
        
        if ( this.hunger == 0 ) {
            this.happiness = constrain(this.happiness - this.happyTick, 0, 100);
        }
        
        if ( this.bladder == 0 ) {
            this.state == 2;
            this.happiness = Math.floor(this.happiness / 2);
        }
        
        if ( this.energy == 0 ) {
            this.state == 1;
            this.happiness = Math.floor(this.happiness / 2);
        }
        
        
        
        this.age++;
        this.updateMood();
        
        if ( this.happiness == 0 && this.hunger == 0 ) {
            this.die();
        }
        
        this.curSprite = this.tileLibrary[ spriteBoard[ this.state ][ this.mood ][ this.curFrame % spriteBoard[ this.state ][ this.mood ].length ] ];
        
        this.curFrame++;
    }
    
    updateMood() {
        
        if ( this.bladder < 25 ) {
            this.mood = 5;
        } else if (this.energy < 25 ) {
            this.mood = 4;
        } else if ( this.hunger > 50 ) {
            if ( this.happiness > 50 ) {
                this.mood = 0;
            } else {
                this.mood = 2;
            }
        } else {
            if ( this.happiness > 50 ) {
                this.mood = 1;
            } else {
                this.mood = 3;
            }
        }
    }
    
    setMood(mood) {
        this.mood = mood;
    }
    
    decodeMood() {
        return moodboard[this.mood];
    }
    
    draw(p) {
        if ( this.state == 0 && this.idleFlag ) {
            // idle events
            this.idleFlag = false;
            
            let idleEvent = Math.floor(random(0,0));
            
            console.log("IDLE ACTION: " + idleEvent);
            
            switch (idleEvent) {
                case 0:
                    this.moveToX = Math.floor(random(24, 128-24));
                    break;
                default:
                    break;
            }
            
            let idlePeriod = Math.floor(random(3000,8000));
            console.log("Next idle action: " + idlePeriod);
            setTimeout(function(){
                this.idleFlag = true;
                console.log("Idle flag back!:" + this.idleFlag);
            }, idlePeriod);
        } else {
            //console.log( "this.state: " + this.state );
            //console.log(" this.idleflag: " + this.idleFlag );
        }
        
        if ( this.state == 0 || this.state == 5 ) {
            if ( this.moveToX != this.posX ) {
                this.state = 5;
            } else {
                this.state = 0;
            }
        }
        
        if ( this.moveToX < this.posX ) {
            //console.log("moving right");
            this.posX = constrain(this.posX - this.walkSpeed, this.moveToX, this.posX);
        } else if ( this.moveToX > this.posX ) {
            //console.log("moving left");
            this.posX = constrain(this.posX + this.walkSpeed, this.posX, this.moveToX);
        } else {
            this.gotocallback();
            this.gotocallback = function() {
            }
        }
        
        
        //p.text("i'm " + this.decodeMood(), this.posX,this.posY);
        p.image(this.curSprite, this.posX - Math.floor(this.curSprite.width / 2), this.posY - this.curSprite.height);
    }
    
    play() {
        this.tick = setInterval(this.update(), this.tickLength);
    }
    
    feed(value) {
        this.hunger = constrain( this.hunger + value, 0, 100 );
    }
    
    danceToggle() {    
        if ( this.state != 3 ) {
            this.curSong = this.songLibrary[ songChoices[this.mood][ Math.floor( Math.random() * songChoices[this.mood].length ) ] ];
            console.log( this.curSong );
            this.state = 3;
            this.playing = true;
            this.curSong.play();
        } else {
            this.state = 0;
            this.playing = false;
            this.curSong.stop();
        }
        
        this.curSprite = this.tileLibrary[ spriteBoard[ this.state ][ this.mood ][ this.curFrame % spriteBoard[ this.state ][ this.mood ].length ] ];
    }
    
    sleepToggle() {
        if ( this.state != 1 ) {
            this.state = 1;
        } else {
            this.state = 0;
        }
        
        this.curSprite = this.tileLibrary[ spriteBoard[ this.state ][ this.mood ][ this.curFrame % spriteBoard[ this.state ][ this.mood ].length ] ];
    }
    
    peeToggle() {
        if ( this.state != 2 ) {
            this.state = 2;
        } else {
            this.state = 0;
        }
        
        this.curSprite = this.tileLibrary[ spriteBoard[ this.state ][ this.mood ][ this.curFrame % spriteBoard[ this.state ][ this.mood ].length ] ];
    }
    
    die() {
        console.log("Dying...");
        this.state = 4;
    }
    
    jumpToPos( posX, posY ) {
        this.posX = posX;
        this.posY = posY;
        this.moveToX = posX;
    }
    
    moveToPos( posX, callback ) {
        this.moveToX = posX;
        this.gotocallback = callback;
    }
}