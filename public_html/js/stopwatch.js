var SEC_IN_A_MIN = 60;
var SEC_IN_AN_HOUR = 60 * SEC_IN_A_MIN;
var SEC_IN_A_DAY = 24 * SEC_IN_AN_HOUR;

var timer_up;           //stores return value of count up setInterval()
var timer_down;         //stores return value of count down setInterval()

var countTarget;        //input target
    
var countUpWatch = {
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
    active: 0,          //1 for active, 0 for stopped
    target: -1,
    current: 0,         //total seconds counted
    direction: 1        //1 for count up, -1 for dount down
};

var countDownWatch = {
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
    active: 0,          //1 for active, 0 for stopped
    target: -1,
    current: 0,         //total seconds counted
    direction: -1       //1 for count up, -1 for dount down
};

/* Increments count up watch */
function tick_up(watch) {
    /* Check whether reached target */
    if(watch.current >= watch.target) {
        pauseWatch(watch);
        document.getElementById("start_up_button").disabled = true;
        document.getElementById("stop_up_button").disabled = true;
        return;
    }
    
    watch.current++;
    watch.sec++;

    if(watch.sec >= 60) {
        watch.sec = 0;
        watch.min++;

        if(watch.min >= 60) {
            watch.min = 0;
            watch.hour++;
            
            if(watch.hour >= 24) {
                watch.hour = 0;
                watch.day++;
            }
        }
    }
    
    display(watch);
}

/* Increments count up watch */
function tick_down(watch) {
    /* Check whether reached target */
    if(watch.current >= watch.target) {
        pauseWatch(watch);
        document.getElementById("start_down_button").disabled = true;
        document.getElementById("stop_down_button").disabled = true;
        return;
    }
    
    watch.current++;
    watch.sec--;

    if(watch.sec < 0) {
        watch.sec = 59;
        watch.min--;

        if(watch.min < 0) {
            watch.min = 59;
            watch.hour--;

            if(watch.hour < 0) {
                watch.hour = 23;
                watch.day--;
            }
        }
    }
    
    display(watch);
}

/* Reset time formatting according to input */
function resetTime(watch, seconds) {
    var cur = seconds;
    watch.day = Math.floor(cur / SEC_IN_A_DAY);
    cur = cur % SEC_IN_A_DAY;

    watch.hour = Math.floor(cur / SEC_IN_AN_HOUR);
    cur = cur % SEC_IN_AN_HOUR;
    
    watch.min = Math.floor(cur / SEC_IN_A_MIN);
    cur = cur % SEC_IN_A_MIN;

    watch.sec = Math.ceil(cur);

    display(watch);
}

/* Display timer */
function display(watch) {
    /* set appropriate unit */
    if(watch.day > 1)    day_text = "days";
    else        day_text = "day";
    if(watch.hour > 1)    hour_text = "hours";
    else        hour_text = "hour";
    if(watch.min > 1)    min_text = "minutes";
    else        min_text = "minute";
    if(watch.sec > 1)    sec_text = "seconds";
    else        sec_text = "second";
        

    /* change text */
    if(watch.direction === 1 ) {
        document.getElementById("display_1").innerHTML = watch.day + " " +
                day_text + " " + watch.hour + " " + hour_text + " " + 
                watch.min + " " + min_text + " " + watch.sec + " " + sec_text;
    }
    else if(watch.direction === -1) {
        document.getElementById("display_2").innerHTML = watch.day + " " +
                day_text + " " + watch.hour + " " + hour_text + " " + 
                watch.min + " " + min_text + " " + watch.sec + " " + sec_text;
    }   
}

/* Prepration to start tick */
function startWatch(watch) {
    countTarget = document.getElementById('count_target').value;
    /* check whether input is valid */
    if(countTarget % 1 !== 0) {
        countTarget = 0;
    }
    
    /* Stopwatch type: count up */
    if(watch.direction === 1) {
        /* Set target time if first time invoking */
        if(watch.target === -1) {
            watch.target = countTarget;
            watch.current = 0;
            resetTime(watch, 0);
        }
        watch.active = 1;
        document.getElementById("start_up_button").disabled = true;
        document.getElementById("stop_up_button").disabled = false;
        timer_up = setInterval(function(){tick_up(watch);}, 1000);        
    }
    
    /* Stopwatch type: count down */
    else if(watch.direction === -1) {
        /* Reset target time if first time invoking */
        if(watch.target === -1) {
            watch.target = countTarget;
            watch.current = 0;
            resetTime(watch, countTarget);
        }
        watch.active = 1;
        document.getElementById("start_down_button").disabled = true;
        document.getElementById("stop_down_button").disabled = false;
        timer_down = setInterval(function(){tick_down(watch);}, 1000);
    } 
}

/* pause timer */
function pauseWatch(watch) {
    /* Stopwatch type: count up */
    if(watch.direction === 1 && watch.active === 1) {
        clearInterval(timer_up);
        watch.active = 0;
        document.getElementById("stop_up_button").disabled = true;
        document.getElementById("start_up_button").disabled = false;
    }
    
    /* Stopwatch type: count down */
    else if(watch.direction === -1 && watch.active === 1) {
        clearInterval(timer_down);
        watch.active = 0;
        document.getElementById("stop_down_button").disabled = true;
        document.getElementById("start_down_button").disabled = false;
    }
}

/* reset timer */
function resetWatch(watch) {
    countTarget = document.getElementById('count_target').value;
    /* check whether input is valid */
    if(countTarget % 1 !== 0) {
        countTarget = 0;
        return;
    }

    /* Stopwatch type: count up */
    if(watch.direction === 1) {
        watch.target = countTarget;
        watch.current = 0;
        resetTime(watch, 0);
        document.getElementById("start_up_button").disabled = false;
        document.getElementById("stop_up_button").disabled = false;
    }
    
    /* Stopwatch type: count down */
    else if(watch.direction === -1) {
        watch.target = countTarget;
        watch.current = 0;
        resetTime(watch, countTarget);
        document.getElementById("start_down_button").disabled = false;
        document.getElementById("stop_down_button").disabled = false;
    }
}

/* Button handlers */
function start_1() {
    startWatch(countUpWatch);
}

function pause_1() {
    pauseWatch(countUpWatch);
}

function reset_1() {
    resetWatch(countUpWatch);
}

function start_2() {
    startWatch(countDownWatch);
}

function pause_2() {
    pauseWatch(countDownWatch);
}

function reset_2() {
    resetWatch(countDownWatch);
}