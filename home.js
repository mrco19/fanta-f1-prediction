"use strict";

/* ==========================================================
   HOME.JS
========================================================== */

const HOME = {

    gpName: document.getElementById("gpName"),

    weekendType: document.getElementById("weekendType"),

    gpStatus: document.getElementById("gpStatus"),

    gpCardName: document.getElementById("gpCardName"),

    gpCardWeekend: document.getElementById("gpCardWeekend"),

    gpCardStatus: document.getElementById("gpCardStatus"),

    gpDate: document.getElementById("gpDate"),

    gpCircuit: document.getElementById("gpCircuit"),

    leader: document.getElementById("leader"),

    leaderPoints: document.getElementById("leaderPoints"),

    totalGP: document.getElementById("totalGP"),

    lastWinner: document.getElementById("lastWinner"),

    lastPole: document.getElementById("lastPole")

};
/* ==========================================================
   AGGIORNA HOME
========================================================== */

async function updateHome(){

    try{

        const weekend = await loadWeekend();

        if(!weekend){

            return;

        }

        HOME.gpName.textContent = weekend.name || "-";

        HOME.weekendType.textContent = weekend.type || "-";

        HOME.gpCardName.textContent = weekend.name || "-";

        HOME.gpCardWeekend.textContent = weekend.type || "-";

        HOME.gpDate.textContent = weekend.startDate || "-";

        HOME.gpCircuit.textContent = weekend.circuit || "-";

    }

    catch(error){

        console.error("Errore Home:", error);

    }

}
document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateHome();

    }

);
