function Player(x, y, world) {
    // store the player position
    this.x = x;
    this.y = y;

    // store a reference to our "world" object - we will ask the world to tell us about
    // tiles that are in our path
    this.world = world;

    // define our speed
    this.speed = 3;
    
    // dimensions
    this.width = 20;
    this.height = 20;
    
    this.held = -1;
    
    this.numFrames = 3;
    
    this.loadFrames = function( directory ) {
        let buf = [];
        
        for ( let i = 0; i < this.numFrames; i++ ) {            
            buf.push( loadImage(  directory + '_' + i + '.png' ) );
        }
        
        console.log( buf );
        
        return buf;
    }
    
    this.artworkLeft = this.loadFrames( 'assets/player/left' );
    this.artworkRight = this.loadFrames( 'assets/player/right' );
    this.artworkUp = this.loadFrames( 'assets/player/up' );
    this.artworkDown = this.loadFrames( 'assets/player/down' );
    
    this.currentImage = this.artworkDown;
    this.currentFrame = 0;
    
    this.targetImg = loadImage( 'assets/player/target.png' );
    
    this.speaking = false;
    this.speakingFrames = this.loadFrames( 'assets/effects/speaking' );
    this.currentSpeaking = 0;
    

    // display our player
    this.display = function() {
        imageMode(CORNER);
        this.displayTarget();
        fill('black');
        //this.displayHeld();
        fill('white');
        image(this.currentImage[this.currentFrame % this.numFrames], this.x, this.y);
        //rect(this.x, this.y, this.width, this.height);
        
        if ( this.speaking ) {
            image( this.speakingFrames[this.currentSpeaking % this.numFrames], this.x, this.y - 32);
        }
        
    }

    // display "sensor" positions
    this.displaySensor = function(direction) {
        fill(255);
        if (direction == "up") {
            //ellipse(this.top[0], this.top[1], 20, 20);
        } else if (direction == "down") {
            //ellipse(this.bottom[0], this.bottom[1], 20, 20);
        } else if (direction == "right") {
            //ellipse(this.right[0], this.right[1], 20, 20);
        } else if (direction == "left") {
            //ellipse(this.left[0], this.left[1], 20, 20);
        }
    }

    // set our sensor positions (computed based on the position of the character and the
    // size of our graphic)
    this.refreshSensors = function() {
        this.left = [this.x, this.y + this.height / 2];
        this.right = [this.x + this.height, this.y + this.height / 2];
        this.top = [this.x + this.width / 2, this.y];
        this.bottom = [this.x + this.width / 2, this.y + this.height ];
    }
    
    this.target = this.world.getTile(this.x, this.y, true);
    
    this.displayTarget = function() {
        //rect(this.target.x * this.world.tileSize, this.target.y * this.world.tileSize, this.world.tileSize, this.world.tileSize);
        imageMode(CORNER);
        image( this.targetImg, this.target.x * this.world.tileSize, this.target.y * this.world.tileSize );
    }
    
    this.displayHeld = function() {
        text( this.held, this.x, this.y );
    }
    
    this.updateTarget = function(x,y) {
        this.target = this.world.getTile(x, y, true);
    }

    // move our character
    this.move = function() {
        // refresh our "sensors" - these will be used for movement & collision detection
        this.refreshSensors();
        let touchedTiles = [];

        // see if one of our movement keys is down -- if so, we should try and move
        // note that this character responds to the following key combinations:
        // WASD
        // wasd
        // The four directional arrows
        if (keyIsDown(LEFT_ARROW) || keyIsDown(97) || keyIsDown(65)) {

            // see which tile is to our left
            var tile = world.getTile(this.left[0], this.left[1]);
            touchedTiles.push( tile );
            this.updateTarget( this.left[0] - this.world.tileSize, this.left[1] );

            // would moving in this direction require a room change?
            if (tile == "roomChange") {
                // ask the world to request a room change
                world.changeRoom("left");

                // move the player into the new room
                this.x = width - this.currentImage.width;
            }

            // otherwise this is a regular tile
            else {

                // is this tile solid?
                if (!world.isTileSolid(tile)) {
                    // move
                    this.x -= this.speed;
                    world.moveLeft();
                }
            }

            // change artwork
            this.currentImage = this.artworkLeft;
            this.currentFrame++;
            this.displaySensor("left");
        }
        
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(100) || keyIsDown(68)) {
            // see which tile is to our right
            var tile = world.getTile(this.right[0], this.right[1]);
            touchedTiles.push( tile );
            this.updateTarget( this.right[0] + this.world.tileSize, this.right[1] );

            // would moving in this direction require a room change?
            if (tile == "roomChange") {
                // ask the world to request a room change
                world.changeRoom("right");

                // move the player into the new room
                this.x = 0 + this.currentImage.width;
            }

            // otherwise this is a regular tile
            else {

                // is this tile solid?
                if (!world.isTileSolid(tile)) {
                    // move
                    this.x += this.speed;
                    world.moveRight();
                }
            }

            // change artwork
            this.currentImage = this.artworkRight;
            this.currentFrame++;
            this.displaySensor("right");
        }
        
        if (keyIsDown(DOWN_ARROW) || keyIsDown(115) || keyIsDown(83)) {
            // see which tile is below us
            var tile = world.getTile(this.bottom[0], this.bottom[1]);
            touchedTiles.push( tile );
            this.updateTarget( this.bottom[0], this.bottom[1] + this.world.tileSize );

            // would moving in this direction require a room change?
            if (tile == "roomChange") {
                // ask the world to request a room change
                world.changeRoom("down");

                // move the player into the new room
                this.y = 0 + this.currentImage.height;
            }

            // otherwise this is a regular tile
            else {

                // is this tile solid?
                if (!world.isTileSolid(tile)) {
                    // move
                    this.y += this.speed;
                    world.moveDown();
                }
            }

            // change artwork
            this.currentImage = this.artworkDown;
            this.currentFrame++;
            this.displaySensor("down");
        }
        
        if (keyIsDown(UP_ARROW) || keyIsDown(119) || keyIsDown(87)) {
            // see which tile is below us
            var tile = world.getTile(this.top[0], this.top[1]);
            touchedTiles.push( tile );
            this.updateTarget( this.top[0], this.top[1] - this.world.tileSize );

            // would moving in this direction require a room change?
            if (tile == "roomChange") {
                // ask the world to request a room change
                world.changeRoom("up");

                // move the player into the new room
                this.y = height - this.currentImage.height;
            }

            // otherwise this is a regular tile
            else {
                // is this tile solid?
                if (!world.isTileSolid(tile)) {
                // move
                    this.y -= this.speed;
                    world.moveUp();
            }
        }

        // change artwork
        this.currentImage = this.artworkUp;
        this.currentFrame++;
        this.displaySensor("up");
        }
        
        if ( !(keyIsDown(UP_ARROW) || keyIsDown(119) || keyIsDown(87)) && !(keyIsDown(DOWN_ARROW) || keyIsDown(115) || keyIsDown(83)) &&  !(keyIsDown(LEFT_ARROW) || keyIsDown(97) || keyIsDown(65)) && !(keyIsDown(RIGHT_ARROW) || keyIsDown(100) || keyIsDown(68)) ) {
            // idle anim
            this.currentFrame = 0;
        }
        
        return touchedTiles;
    }
}