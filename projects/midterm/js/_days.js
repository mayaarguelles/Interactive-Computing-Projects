function Gametime(day, time) {
    this.day = day;
    this.time = time;
    this.paused = false;
    
    this.progressTime = function() {
        if ( this.time.progressTime() ) {
            this.day++;
        }
    }
    
    this.pause = function() {
        this.paused = true;
        this.time.paused = true;
    }
    
    this.resume = function() {
        this.paused = false;
        this.time.paused = false;
    }
}

function Timeformat(hour, minute) {
    this.hour = hour;
    this.minute = minute;
    this.paused = false;
    
    this.updateTime = function(hour,minute) {
        this.hour = hour;
        this.minute = minute;
    }
    
    /* progressTime
     *
     * progresses one minute. returns a 
     */
    this.progressTime = function() {
        if ( !this.paused ) {
            this.minute++;
            if ( this.minute > 60 ) {
                this.hour++;
                this.minute = 0;
            } if ( this.hour > 24 ) {
                this.hour = 0;
                return true;
            }
            return false;
        }
    }
}