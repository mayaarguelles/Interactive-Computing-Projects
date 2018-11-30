var canvas;
var petObj;
var buttons = document.querySelectorAll('.interaction button');
var hungerSpan = document.querySelector('#hunger');
var happinessSpan = document.querySelector('#happiness');

function setup() {
    petObj = new Pet()
    canvas = createCanvas(petObj.width, petObj.height);
}

function draw() {
    background('white');
    petObj.draw();
    
    showVitals();
}

function showVitals() {
    hungerSpan.textContent = petObj.hunger;
    happinessSpan.textContent = petObj.happiness;
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
        default:
            break;
    }
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', 'buttonHandler');
}