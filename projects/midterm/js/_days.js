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
     * progresses one minute. returns a boolean that determines if the day has changed
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
    
    /* toString
     *
     */
    this.toString = function() {
        let timeBuff = "";
        
        timeBuff += ( this.hour % 12 );
        
        timeBuff += ":";
        
        if ( this.minute < 10 ) {
            timeBuff += "0";
        }
        
        timeBuff += this.minute;
        
        if ( this.hour >= 12 ) {
            timeBuff += " PM";
        } else {
            timeBuff += " AM";
        }
        
        return timeBuff;
    }
}

function Gametime(day, time) {
    this.day = day;
    this.time = time;
    this.paused = false;
    
    this.progressTime = function() {
        if ( this.time.progressTime() ) {
            this.day++;
            return true;
        }
        return false;
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