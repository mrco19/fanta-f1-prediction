"use strict";

/* ==========================================================
   COUNTDOWN ENGINE
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

        hours:Math.floor(

            (difference%(1000*60*60*24))

            /(1000*60*60)

        ),

        minutes:Math.floor(

            (difference%(1000*60*60))

            /(1000*60)

        ),

        seconds:Math.floor(

            (difference%(1000*60))

            /1000

        )

    };

}
