/*--------------------------------*\
	 GLOBAL VARIABLES
\*--------------------------------*/

// canvas config
const canvasWidth = 480;
const canvasHeight = 380;

// collision config
const borderLeft = 0;
const borderRight = canvasWidth;

// paddle config
const paddleY = canvasHeight - 24;
const paddleWidth = 64;
const paddleHeight = 8;
const paddleColor = 'rgb(255,255,255)';
const paddleSpeedCoeff = 1;
const maxPaddleSpeed = 12;
var playerPaddle = new Paddle( paddleWidth, paddleHeight, paddleColor, paddleSpeedCoeff, maxPaddleSpeed );


function setup() {
    // set the background size of our canvas
    createCanvas(canvasWidth, canvasHeight);

    background('rgb(20,19,24)');
}

function draw() {
    background('rgb(20,19,24)');
    playerPaddle.updatePos();
    playerPaddle.draw();
    if ( keyIsPressed ) {
        playerPaddle.updateSpeed( key );
    } else {
        playerPaddle.decelerate();
    }
}


/*--------------------------------*\
	 PADDLE BEHAVIOR
\*--------------------------------*/

/*
 * Paddle: 
 *
 * @param paddleWidth width of the paddle
 * @param paddleHeight height of the paddle
 * @param paddleColor color of the paddle
 * @param paddleSpeed speed coefficient of the paddle
 * @param maxPaddleSpeed maximum paddle speed
 */
function Paddle ( paddleWidth, paddleHeight, paddleColor, paddleSpeedCoeff, maxPaddleSpeed ) {
    this.width = paddleWidth;
    this.height = paddleHeight;
    this.posY = paddleY;
    this.posX = ( canvasWidth / 2 ) - Math.floor( paddleWidth / 2 );
    this.color = paddleColor;
    this.speed = 0;
    this.speedCoeff = paddleSpeedCoeff;
    this.terminalSpeed = maxPaddleSpeed;
    this.draw = function() {
        // apply paddle color
        fill( paddleColor );
        
        // draw the paddle
        rect( this.posX, this.posY, this.width, this.height );
        
    };
    
    this.updatePos = function() {
        // console.log( key );
        this.posX += this.speed;
        
        this.posX = checkBoundsX( this.posX, this.width );
    };
    
    this.updateSpeed = function( key ) {
        if ( key == 'a' ) {
            this.speed -= this.speedCoeff;
        } else if ( key == 'd' ) {
            this.speed += this.speedCoeff;
        }
        
        if ( this.speed > this.terminalSpeed ) {
            this.speed = this.terminalSpeed;
        }
    };
    
    this.decelerate = function() {
        this.speed /= 2;
        if ( this.speed < 1 && this.speed > -1 ) {
            this.speed = 0;
        }
    }
}

function checkBoundsX( posX, width ) {
    if ( posX < borderLeft ) {
        return borderLeft;
    } else if ( ( posX + width ) > borderRight ) {
        return borderRight - width;
    }
    
    return posX;
}