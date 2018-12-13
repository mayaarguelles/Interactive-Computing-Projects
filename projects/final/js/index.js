var petObj;
var petInterval;

var buttons;
var hungerSpan;
var happinessSpan;
var bladderSpan;
var energySpan;
var loadedDOM = false;



function setup() {
    noCanvas();
    
    petObj = new Pet();
    
    petInterval = setInterval(function(){
        petObj.update();
    }, petObj.tickLength);
    
    
    var mainRoomInst = new p5( mainRoom );
}

function draw() {
    //showVitals();
}

var mainRoom = function(p) {
    var roomID = 1;
    
    p.setup = function() {
        var canvas = p.createCanvas(128,128);
        canvas.id('mainRoom');
        p.background('rgba(255,255,255,0)');
    }
    
    p.draw = function() {
        if ( petObj.room == roomID ) {
            petObj.draw(p);
        }
        showVitals();
    }
}

var bathroom = function(p) {
    var roomID = 2;
    
    p.setup = function() {
        var canvas = p.createCanvas(128,128);
        canvas.id('bathroom');
        p.background('rgba(255,255,255,0)');
    }
    
    p.draw = function() {
        if ( petObj.room == roomID ) {
            petObj.draw(p);
        }
    }
}

function showVitals() {
    if (loadedDOM) {
        hungerSpan.textContent = petObj.hunger;
        happinessSpan.textContent = petObj.happiness;
        bladderSpan.textContent = petObj.bladder;
        energySpan.textContent = petObj.energy;
    }
}

function buttonHandler() {
    let id = this.getAttribute('id');
    switch(id) {
        case 'feed':
            petObj.feed(10);
            break;
        case 'pet':
            petObj.pet(10);
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
        default:
            break;
    }
}