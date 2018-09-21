/*--------------------------------*\
	 GLOBAL VARIABLES
\*--------------------------------*/

// canvas config
var canvas;
const canvasWidth = 132;
const canvasHeight = 126;

// assets
// sounds
var bounceSound, pingSound, loseSound; 
var overloadSound = false;

// images 
var objectiveSource;

// objective config
const objectiveBottomClear = 80;
var objectiveObj = new Objective();

// collision config
const borderWidth = 8;
const borderLeft = borderWidth;
const borderRight = canvasWidth - borderWidth;
const borderTop = borderWidth;

// game config
var gameIsRunning = false;
var hits = 0;
var hitsText = document.querySelector('#touch .print');
var hitOverload = false;
hitsText.innerHTML = hits;
var losses = 0;
var lossesText = document.querySelector('#off .print');
lossesText.innerHTML = losses;
var score = 0;
var scoreText = document.querySelector('#water .print');
scoreText.innerHTML = score;

// paddle config
const paddleWidth = 48;
const paddleHeight = 16;
const paddleY = canvasHeight - paddleHeight;
const paddleColor = '#f4c5d4';
const paddleSpeedCoeff = 0.5;
const maxPaddleSpeed = 8;
const friction = 2;
var playerPaddle = new Paddle( paddleWidth, paddleHeight, paddleColor, paddleSpeedCoeff, maxPaddleSpeed );


// ball config
const ballRadius = 4;
const ballColor = '#f4c5d4';
const maxBallSpeed = 8;
const randBallBounceRange = 2;
var gameBall = new Ball( ballRadius, ballColor, maxBallSpeed );


/*--------------------------------*\
	 CANVAS
\*--------------------------------*/

function preload() {
    bounceSound = loadSound("sound/bounce.mp3");
    pingSound = loadSound("sound/ping.mp3");
    loseSound = loadSound("sound/lose.mp3");
    objectiveSource = loadImage("img/poo.png");
}

function setup() {
    // set the background size of our canvas
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('tamagotchi');
    canvas.position(128, 128);
    canvas.style("z-index","3");
    
    noStroke();
    imageMode(CENTER);

    background('#0d4631');
    
    objectiveObj.reposition();
}

function draw() {
    background('#0d4631');
    
    fill('#f4c5d4');
    rect(0, 0, canvasWidth, borderWidth);
    rect( 0, 0, borderWidth, canvasHeight);
    rect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);
    
    if ( gameIsRunning ) {
        playerPaddle.updatePos();
        gameBall.updatePos();
        hits += checkPaddleCollision( playerPaddle, gameBall );
        checkObjectiveCollision( objectiveObj, gameBall );
    }
    
    objectiveObj.draw();
    playerPaddle.draw();
    gameBall.draw();
    
    
    if ( keyIsPressed ) {
        playerPaddle.updateSpeed( key );
    } else {
        playerPaddle.decelerate();
    }
    
    checkReset( gameBall );
}

function mouseClicked() {
    if ( !gameIsRunning ) {
        gameIsRunning = true;
        gameBall.init();
    }
}

function keyPressed() {
    if ( !gameIsRunning ) {
        gameIsRunning = true;
        gameBall.init();
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
    this.posX = Math.floor( canvasWidth / 2 ) - Math.floor( paddleWidth / 2 );
    this.color = paddleColor;
    this.speed = 0;
    this.speedCoeff = paddleSpeedCoeff;
    this.terminalSpeed = maxPaddleSpeed;
    
    this.draw = function() {
        // apply paddle color
        fill( paddleColor );
        
        // draw the paddle
        rect( this.posX, this.posY, this.width, this.height );
        
    }
    
    this.updatePos = function() {
        // console.log( key );
        this.posX += this.speed;
        
        this.posX = checkBoundsX( this.posX, this.width );
    }
    
    this.updateSpeed = function( key ) {
        if ( key == 'a' ) {
            this.speed -= this.speedCoeff;
        } else if ( key == 'd' ) {
            this.speed += this.speedCoeff;
        }
        
        if ( this.speed > this.terminalSpeed ) {
            this.speed = this.terminalSpeed;
        }
    }
    
    this.decelerate = function() {
        this.speed /= friction;
        
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

/*--------------------------------*\
	 BALL BEHAVIOR
\*--------------------------------*/

/*
 * Ball:
 *
 * @param float ballRadius radius of ball
 * @param string ballColor color of ball
 */
function Ball ( ballRadius, ballColor, maxBallSpeed ) {
    this.radius = ballRadius;
    this.diameter = this.radius * 2;
    this.color = ballColor;
    this.posX = Math.floor( canvasWidth / 2 );
    this.posY = Math.floor( canvasHeight / 2 );
    this.speedX = 0;
    this.speedY = 0;
    this.terminalSpeed = maxBallSpeed;
    
    this.draw = function() {
        fill( this.color );
        ellipse( this.posX, this.posY, this.diameter, this.diameter );
    }
    
    this.updatePos = function() {
        this.posX += this.speedX;
        this.posY += this.speedY;
        
        if ( ( this.posX - this.radius ) < borderLeft || ( this.posX + this.radius ) > borderRight) {
            this.speedX = bounce( this.speedX, this.terminalSpeed, 'x', this.posX );
        } if ( ( this.posY - this.radius ) < borderTop ) {
            this.speedY = bounce( this.speedY, this.terminalSpeed, 'y', this.posY );
        }
    }
    
    this.hit = function( paddleSpeed ) {
        this.speedY = -1 * Math.abs(bounce( this.speedY, this.terminalSpeed ));
        this.speedX += ( paddleSpeed / 20 );
    }
    
    this.init = function() {
        let initX = (Math.random() * ( this.terminalSpeed / 4 )) + 1;
        let initY = (Math.random() * ( this.terminalSpeed / 4 )) + 1;
        
        let vectX = Math.random();
        let vectY = Math.random();
        
        if ( vectX > 0.5 ) {
            initX *= -1;
        } if ( vectY > 0.5 ) {
            initY *= -1;
        }
        
        this.speedX = initX;
        this.speedY = initY;
    }
    
    this.reset = function() {
        this.speedX = 0;
        this.speedY = 0;
        this.posX = Math.floor( canvasWidth / 2 );
        this.posY = Math.floor( canvasHeight / 2 );
        gameIsRunning = false;
        losses++;
        lossesText.innerHTML = losses;
        loseSound.play();
    }
}


function bounce( speed, terminalSpeed, axis, pos ) {
    let randChange = Math.random() * randBallBounceRange;
    let randVect = Math.random();
    
    if ( randVect > 0.5 ) {
        randChange *= -1;
    }
    
    if ( axis === 'x' ) {
        if ( pos < borderLeft ) {
            speed = Math.abs( speed ) + randChange;
        } else if ( pos > borderRight ) {
            speed = ( -1 * Math.abs( speed ) ) + randChange;
        }
    } else {
        speed = Math.abs( speed ) + randChange;
    }
    
    if ( speed > terminalSpeed ) {
        return terminalSpeed;
    } else if ( speed < ( -1 * terminalSpeed )) {
        return (-1) * terminalSpeed;
    }
    
    if ( !overloadSound ) {
        overloadSound = true;
        bounceSound.play();
        setTimeout(function() {
            overloadSound = false;
        }, 200);
    }
    
    
    return speed;
}

function checkPaddleCollision( paddle, ball ) {
    let ballBot = ball.posY  + ball.radius;
    let ballLeft = ball.posX - ball.radius;
    let ballRight = ball.posX + ball.radius;
    let paddleLeft = paddle.posX;
    let paddleRight = paddle.posX + paddleWidth;
    
    if ( ( ballBot >= paddleY ) && ( (ballRight <= paddleRight && ballLeft >= paddleLeft) ) && !hitOverload  ) {
        hitOverload = true;
        setTimeout(function() {
            hitOverload = false;
        }, 250);
        ball.hit( paddle.speed );
        hitsText.innerHTML = hits;
        return 1;
    }
    
    // for debug 
    //fill('red');
    //rect( paddleLeft, ballBot, paddleRight - paddleLeft , paddleY - ballBot );
    
    return 0;
}

function checkReset( ball ) {
    let ballTop = ball.posY - ball.radius;
    
    if ( ballTop > canvasHeight +( ball.radius ) ) {
        ball.reset();
    }
}

/*--------------------------------*\
	 OBJECTIVE
\*--------------------------------*/

function Objective ( ) {
    this.posX = 0;
    this.posY = 0;
    
    this.width = 9;
    this.height = 9;
    
    this.draw = function () {
        image( objectiveSource, this.posX, this.posY );
    }
    
    this.reposition = function () {
        let randX = random(borderLeft + (this.width / 2), borderRight - (this.width / 2) );
        let randY = random( borderTop + (this.height / 2), canvasHeight - this.height - objectiveBottomClear );
        
        this.posX = randX;
        this.posY = randY;
    }
}

function checkObjectiveCollision( objective, ball ) {
    let d = dist( objective.posX, objective.posY, ball.posX, ball.posY );
    let threshold = (objective.width / 2) +  ball.radius;
    if ( d <= threshold ) {
        objective.reposition();
        pingSound.play();
        score++;
        scoreText.innerHTML = score;
    }
}