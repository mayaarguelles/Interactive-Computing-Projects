const moodboard = {
    0: 'happy',
    1: 'hungry',
    2: 'sad',
    3: 'hungry and sad',
    4: 'dead'
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
        
        /*
         * tick stuff
         */
        this.happyTick = 1;
        this.hungerTick = 1;
        this.tickLength = 1000;
        this.tick = setInterval(this.update(), this.tickLength)
    }
    
    updateMood() {
        if ( this.hunger > 50 ) {
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
    
    update() {
        this.happiness = constrain(this.happiness - this.happyTick, 0, 100);
        this.hunger = constrain(this.hunger - this.hungerTick, 0, 100);
        this.age++;
        this.updateMood();
        
        if ( this.happiness == 0 && this.hunger == 0 ) {
            this.die();
        }
    }
    
    setMood(mood) {
        this.mood = mood;
    }
    
    decodeMood() {
        return moodboard[this.mood];
    }
    
    draw() {
        text("i'm " + this.decodeMood(), 20,20);
    }
    
    pause() {
        clearInterval(this.tick);
    }
    
    play() {
        this.tick = setInterval(this.update(), this.tickLength);
    }
    
    feed(value) {
        this.hunger += value;
    }
    
    pet(value) {
        this.happiness += value;
    }
    
    die() {
        this.pause();
        this.mood = 4;
    }
}