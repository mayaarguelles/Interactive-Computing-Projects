var referenceWidth = window.innerWidth,
    referenceHeight = window.innerHeight;

var posX = Math.floor( referenceWidth / 2 ),
    posY = Math.floor( referenceHeight / 2 );

var h = 0;

var dirX = Math.floor(Math.random() * 3) - 1,
    dirY =  Math.floor(Math.random() * 3) - 1;

while ( dirX == 0 ) {
    dirX = Math.floor(Math.random() * 3) - 1;
}
    
while ( dirY == 0 ) {
    dirY = Math.floor(Math.random() * 3) - 1;
}

var moveInterval = 1;

var textWidthVar = 200,
    textHeight = 56;

// all densities calculated in 500x500 regions
const gridLine = 500;
const numOfXGridLines = Math.ceil( referenceWidth / gridLine );
const numOfYGridLines = Math.ceil( referenceHeight / gridLine );
const numOfGridSquares = numOfXGridLines * numOfYGridLines;

console.log(numOfGridSquares);

var x = 0;

function setup() {
    // set the background size of our canvas
    createCanvas(referenceWidth, referenceHeight);

    // erase the background with a "grey" color
    //background(0, 128,255);
    //rectMode(CENTER); <-- use to draw all rectangles from their center
    noStroke();
    noCursor();
    smooth();
    background('rgb(20,19,24)');
    fill('rgba(255, 255, 255, 0.1)');
    
    for ( var i = 0; i < calcNumByDensity(3); i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        let radRand = Math.floor( Math.random() * 300 ) + 450;
        featheredEllipse( xRand, yRand, radRand, radRand, 'rgba(38,37,51,' );
    }
    
    for ( var i = 0; i < calcNumByDensity(6); i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        let radRand = Math.floor( Math.random() * 250 ) + 250;
        featheredEllipse( xRand, yRand, radRand, radRand, 'rgba(48,50,124,' );
    }
    
    for ( var i = 0; i < calcNumByDensity(25); i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        let radRand = Math.floor( Math.random() * 125 ) + 150;
        featheredEllipse( xRand, yRand, radRand, radRand, 'rgba(30,68,151,' );
    }
    
    for ( var i = 0; i < calcNumByDensity(3); i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        let radRand = Math.floor( Math.random() * 80 ) + 80;
        featheredEllipse( xRand, yRand, radRand, radRand, 'rgba(38,37,51,' );
    }
    
    
    for ( var i = 0; i< 20000; i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        stroke('rgba(30,68,151,0.4)');
        point( xRand, yRand, 1);
    }
    
    for ( var i = 0; i< 10000; i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        stroke('rgba(38,37,51,0.4)');
        point( xRand, yRand, 1, 1);
    }
    
    noStroke();
    
    for (var i = 0; i < calcNumByDensity(55); i++) {
        let xRand = Math.floor( Math.random() * referenceWidth );
        let yRand = Math.floor( Math.random() * referenceHeight );
        let radRand = Math.floor( Math.random() * 5 ) + 10;
        sparkle( xRand, yRand, radRand, 'rgba(24,68,255,');
    }
    
    noFill();
    textSize(80);
    textFont('Times New Roman');
    textAlign(CENTER);
    
}

function draw() {
    h++;
    
    stroke('hsl('+ h % 360 +', 90%, 60%)');
    
    if ( posX - textWidthVar < 0 ) {
        dirX = 1;
    } else if ( posX + textWidthVar > referenceWidth ) {
        dirX = -1;
    } if ( posY - textHeight < 0 ) {
        dirY = 1;
    } else if ( posY  > referenceHeight ) {
        dirY = -1;
    }
    posX += moveInterval * dirX;
    posY += moveInterval * dirY;
    text('Hello world', posX, posY);
    
    let genSparkle = Math.random();
    
    if ( genSparkle > 0.7 ) {
        
        let ranDirX = Math.random();
        let ranDirY = Math.random();
        
        if ( ranDirX > 0.5) {
            ranDirX = 1;
        } else {
            ranDirX = -1;
        }
        
        if ( ranDirY > 0.5) {
            ranDirY = 1;
        } else {
            ranDirY = -1;
        }
        
        let xRand = Math.floor(Math.random() * (textWidthVar + 40) );
        let yRand = Math.floor(Math.random() * (textHeight + 40) );
        let radRand = Math.floor( Math.random() * 5 ) + 10;

        noStroke();
        sparkle( posX + (xRand * ranDirX), posY - ( yRand * dirY ), radRand, 'rgba(24,68,255,');
        noFill();
    }
    
    
}

function featheredEllipse( x, y, radius, distance, colorFrag ) {
    // we will be drawing a circle every 4 pixels, so find the correct opacity so that the outermost ring will be the least opacity and then the innermost ring ( where the distance ends in the circle ) is full opacity
    let opacity = (1 / distance) * 4;
    fill(colorFrag + opacity + ')');
    let interval = 0;
    while ( interval < distance ) {
        // keep track of the current distance from the outermost circle
        interval += 4;
        ellipse( x, y, radius - interval, radius - interval );
    }
}

function sparkle( x, y, radius, colorFrag ) {
    let distance = radius - 3;
    let interval = Math.floor( distance / 4 ) * 3;
    let point = 0;
    let opacity = (1 / distance) / 2;
    featheredEllipse(x,y,radius,colorFrag);
    fill('rgba(255,255,255,'+opacity+')');
    while ( point < distance ) {
        interval++;
        if ( point > 4 ) {
            opacity *= 1.5;
            fill('rgba(255,255,255,'+opacity+')');
        }
        point++;
        beginShape();
        vertex( x - radius, y );
        vertex( x - radius + interval, y + radius - interval );
        vertex( x, y + radius );
        vertex( x + radius - interval, y + radius - interval );
        vertex( x + radius, y );
        vertex( x + radius - interval, y - radius + interval );
        vertex( x, y - radius );
        vertex( x - radius + interval, y - radius + interval );
        vertex( x - radius, y );
        endShape();
    }
}

function calcNumByDensity( density ) {
    return density * numOfGridSquares;
}
