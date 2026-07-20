"use strict";

/* ==========================================================
   COUNTDOWN
========================================================== */

let countdownInterval = null;

/* ==========================================================
   CALCOLA TEMPO RIMANENTE
========================================================== */

function getRemainingTime(targetDate){

    const now = new Date().getTime();

    const target = new Date(targetDate).getTime();

    const difference = target - now;

    if(difference <= 0){

        return{

            expired:true,

            days:0,

            hours:0,

            minutes:0,

            seconds:0

        };

    }

    return{

        expired:false,

        days:Math.floor(difference/(1000*60*60*24)),

        hours:Math.floor((difference%(1000*60*60*24))/(1000*60*60)),

        minutes:Math.floor((difference%(1000*60*60))/(1000*60)),

        seconds:Math.floor((difference%(1000*60))/1000)

    };

}

/* ==========================================================
   AGGIORNA COUNTDOWN
========================================================== */

function updateCountdown(targetDate){

    const element = document.getElementById("countdown");

    if(!element){

        return;

    }

    const time = getRemainingTime(targetDate);

    if(time.expired){

        element.textContent = "Pronostici chiusi";

        return;

    }

    element.textContent =

        `${time.days}g ` +

        `${String(time.hours).padStart(2,"0")}:` +

        `${String(time.minutes).padStart(2,"0")}:` +

        `${String(time.seconds).padStart(2,"0")}`;

}

/* ==========================================================
   AVVIA COUNTDOWN
========================================================== */

function startCountdown(targetDate){

    if(!targetDate){

        return;

    }

    if(countdownInterval){

        clearInterval(countdownInterval);

    }

    updateCountdown(targetDate);

    countdownInterval = setInterval(()=>{

        updateCountdown(targetDate);

    },1000);

}
