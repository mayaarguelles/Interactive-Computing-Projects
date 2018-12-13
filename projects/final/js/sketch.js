// variable to hold a reference to our A-Frame world
var world;
var petObj;
var petInterval;
var buttons = document.querySelectorAll('.interaction button');
var hungerSpan = document.querySelector('#hunger');
var happinessSpan = document.querySelector('#happiness');
var bladderSpan = document.querySelector('#bladder');
var energySpan = document.querySelector('#energy');
var bathroomButton = document.querySelector('#pee');
var notMoving = true;

var borders = false;

var kitchenOBJ;

function preload() {
    petObj = new Pet();
}

function setup() {
	// no canvas needed
	noCanvas();
    
    petInterval = setInterval(function(){
        petObj.update();
    }, petObj.tickLength);

	// run the the first sketch and add it to the page
	// it will be added to the page using an id of 'firstCanvas' (see the setup function)
	var mainRoomInst = new p5(mainRoom);

	// this one will be added as 'secondCanvas'
	var bathroomInst = new p5(bathroom);
    
    var transpInst = new p5(transparent);
    
    // create our world (this also creates a p5 canvas for us)
    world = new World('ARScene');

    // grab a reference to the marker that we set up on the HTML side (connect to it using its 'id')
    marker = world.getMarker('hiro');
    marker2 = world.getMarker('zb');

    // create some geometry to add to our marker
    // the marker is 1 meter x 1 meter, with the origin at the center
    // the x-axis runs left and right
    // -0.5, 0, -0.5 is the top left corner
    var room = new Box({
        x:0, y:-1, z:0,
        red:180, green:180, blue:180,
        width:1, height:2, depth:1,
        side: 'back',
        roughness: 0
    });
    
    var overlay = new Plane({
        x: 0, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 0.8,
        side: 'double',
        asset: 'mainRoom'
    });
    
    var clearTop = new Plane({
        x: 1, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearLeft = new Plane({
        x: 0, y: 0, z:1,
        scaleX: 3, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearRight = new Plane({
        x: -1, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearBot = new Plane({
        x: 0, y: 0, z:-1,
        scaleX: 3, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    kitchenOBJ = new OBJ({
        x: 0.19, y: -0.95, z: 0.29,
        asset: 'kitchen_obj',
        mtl: 'kitchen_mtl',
        rotationX: 90, rotationY: 0, rotationZ: 0,
        scaleX: -0.8, scaleY: -0.8, scaleZ: -0.8
    })
    
    marker.addChild( room );
    marker.addChild( overlay );
    if ( borders ) {
        marker.addChild( clearTop );
        marker.addChild( clearBot );
        marker.addChild( clearLeft );
        marker.addChild( clearRight );
    }
    marker.addChild( kitchenOBJ );
    
    var room2 = new Box({
        x:0, y:-0.3, z:0,
        red:180, green:180, blue:180,
        width:1, height:0.7, depth:1,
        side: 'back',
        roughness: 0
    });
    
    var clearTop2 = new Plane({
        x: 1, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearLeft2 = new Plane({
        x: 0, y: 0, z:1,
        scaleX: 3, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearRight2 = new Plane({
        x: -1, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var clearBot2 = new Plane({
        x: 0, y: 0, z:-1,
        scaleX: 3, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 1,
        side: 'double',
        asset: 'transparent'
    });
    
    var overlay2 = new Plane({
        x: 0, y: 0, z:0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: -90,
        opacity: 0.8,
        side: 'double',
        asset: 'bathRoom'
    });
    
    marker2.addChild( room2 );
    marker2.addChild( overlay2 );
    if ( borders ) {
        marker2.addChild( clearTop2 );
        marker2.addChild( clearBot2 );
        marker2.addChild( clearLeft2 );
        marker2.addChild( clearRight2 );}
    

}

function draw() {
    if ( petObj.state == 4 ) {
        clearInterval( petInterval );
    }
    
    let hiroPosition = marker.getScreenPosition();
    let zbPosition = marker2.getScreenPosition();
    
    if ( petObj.room == 0 ) {
        if ( marker.isVisible() ) {
            petObj.room = 1;
        } else if ( marker2.isVisible() ) {
            petObj.room = 2;
            bathroomButton.removeAttribute('disabled');
        }
    }
    
    if ( dist(hiroPosition.x, hiroPosition.y, zbPosition.x, zbPosition.y) < 100 && notMoving && marker.isVisible() && marker2.isVisible() ) {
        console.log('close!');
        notMoving = false;
        if ( petObj.room == 1 ) {
            if ( hiroPosition.x < zbPosition.x ) {
                petObj.moveToPos(128, function(){
                    bathroomButton.removeAttribute('disabled');
                    petObj.room = 2;
                    petObj.jumpToPos(0,128);
                    petObj.moveToPos(64);
                    setTimeout(function(){
                        notMoving = true;
                    }, 3000);
                });
            } else {
                petObj.moveToPos(0, function(){
                    bathroomButton.removeAttribute('disabled');
                    petObj.jumpToPos(128,128);
                    petObj.room = 2;
                    petObj.moveToPos(64);
                    setTimeout(function(){
                        notMoving = true;
                    }, 3000);
                });
            }
        } else if ( petObj.room == 2 ) {
            if ( zbPosition.x < hiroPosition.x ) {
                petObj.moveToPos(128, function(){
                    bathroomButton.setAttribute('disabled', true);
                    petObj.room = 1;
                    petObj.jumpToPos(0,128);
                    petObj.moveToPos(64);
                    setTimeout(function(){
                        notMoving = true;
                    }, 3000);
                });
            } else {
                petObj.moveToPos(0, function(){
                    bathroomButton.setAttribute('disabled', true);
                    petObj.jumpToPos(128,128);
                    petObj.room = 1;
                    petObj.moveToPos(64);
                    setTimeout(function(){
                        notMoving = true;
                    }, 3000);
                });
            }
        }
    }
}



// create a variable which holds a reference to an anonymous function
// this function encapsulates all of the functionality of a p5 sketch
// note that you have to prefix every call to a p5.js API element with the argument 'p'
var mainRoom = function(p) {
    
    var roomID = 1;

	p.setup = function() {
		var myCanvas = p.createCanvas(128,128);
		myCanvas.id("mainRoom");
	}
	p.draw = function() {
        p.clear();
        if ( petObj.room == roomID ) {
            petObj.draw(p);
        }
        
        showVitals();
	}
}



var bathroom = function(p) {
    
    var roomID = 2;

	var bouncers = [];

	p.setup = function() {
		var myCanvas = p.createCanvas(128,128);
		myCanvas.id("bathRoom");
	}

	p.draw = function() {
        p.clear();
        if ( petObj.room == roomID ) {
            petObj.draw(p);
        }
	}

	class Bouncer {
		constructor() {
			this.x = p.random(0,p.width);
			this.y = p.random(0,p.height);
			this.c = p.color( p.random(255), p.random(255), p.random(255) );
			this.xSpeed = p.random(-3,3);
			this.ySpeed = p.random(-3,3);
		}

		moveAndDisplay() {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			if (this.x > p.width || this.x < 0) {
				this.xSpeed *= -1;
			}
			if (this.y > p.height || this.y < 0) {
				this.ySpeed *= -1;
			}
			p.fill(this.c);
			p.ellipse(this.x, this.y, 25, 25);
		}
	}
}

var transparent = function(p) {
    
    p.setup = function() {
        var myCanvas = p.createCanvas(2,2);
        myCanvas.id('transparent');
    }
    
    p.draw = function() {
        p.clear();
    }
    
}


function showVitals() {
    /*hungerSpan.textContent = petObj.hunger;
    happinessSpan.textContent = petObj.happiness;
    bladderSpan.textContent = petObj.bladder;
    energySpan.textContent = petObj.energy;*/
    
    hungerSpan.style.width = petObj.hunger + "%";
    happinessSpan.style.width = petObj.happiness + "%";
    bladderSpan.style.width = petObj.bladder + "%";
    energySpan.style.width = petObj.energy + "%";
}

function buttonHandler() {
    let id = this.getAttribute('id');
    switch(id) {
        case 'feed':
            petObj.feed(10);
            break;
        case 'pet':
            petObj.danceToggle();
            break;
        case 'sleep':
            petObj.sleepToggle();
            break;
        case 'pee':
            petObj.peeToggle();
            break;
        case 'gotomain':
            petObj.room = 1;
            break;
        case 'gotobr':
            petObj.room = 2;
            break;
        case 'goto128':
            petObj.moveToPos(128,function(){
                alert('done');
            });
        default:
            break;
    }
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', buttonHandler);
}
