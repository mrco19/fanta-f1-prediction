"use strict";

/* ==========================================================
   FANTA F1 PREDICTION
   ADMIN.JS
   Versione 1.0
========================================================== */

/* ==========================================================
   CACHE DOM
========================================================== */

const pages = document.querySelectorAll(".page");
const buttons = document.querySelectorAll(".menu-btn");

/* ==========================================================
   CAMBIO PAGINA
========================================================== */

function showPage(pageId){

    /* Nasconde tutte le pagine */

    pages.forEach(page=>{

        page.classList.remove("active");

    });

    /* Disattiva tutti i pulsanti */

    buttons.forEach(button=>{

        button.classList.remove("active");

    });

    /* Mostra la pagina scelta */

    const selectedPage = document.getElementById(pageId);

    if(selectedPage){

        selectedPage.classList.add("active");

    }

    /* Evidenzia il pulsante */

    const selectedButton =

        document.querySelector(

            `.menu-btn[data-page="${pageId}"]`

        );

    if(selectedButton){

        selectedButton.classList.add("active");

    }

}

/* ==========================================================
   EVENTI MENU
========================================================== */

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        const page = button.dataset.page;

        showPage(page);

    });

});

/* ==========================================================
   DASHBOARD TEMPORANEA
========================================================== */

document.getElementById("currentGP").textContent =
"Gran Premio del Belgio";

document.getElementById("currentRound").textContent =
"Round 13";

document.getElementById("currentWeekendType").textContent =
"Weekend Sprint";

document.getElementById("predictionStatus").textContent =
"🟢 Pronostici aperti";

/* ==========================================================
   AVVIO
========================================================== */

showPage("dashboard");
/* ==========================================================
   CARICA WEEKEND.JSON
========================================================== */

async function loadWeekend(){

    try{

        const response = await fetch("weekend.json");

        if(!response.ok){

            throw new Error("weekend.json non trovato");

        }

        const weekend = await response.json();

        document.getElementById("gpNameInput").value =
            weekend.name || "";

        document.getElementById("gpCircuitInput").value =
            weekend.circuit || "";

        document.getElementById("gpCountryInput").value =
            weekend.country || "";

        document.getElementById("gpFlagInput").value =
            weekend.flag || "";

        document.getElementById("gpRoundInput").value =
            weekend.round || "";

        document.getElementById("gpSprintInput").value =
            weekend.sprint ? "true" : "false";

        document.getElementById("gpStartInput").value =
            formatDateTimeLocal(weekend.startDate);

        document.getElementById("gpEndInput").value =
            formatDateTimeLocal(weekend.endDate);

        document.getElementById("gpCloseInput").value =
            formatDateTimeLocal(weekend.predictionsClose);

        console.log("✅ Weekend caricato");

    }

    catch(error){

        console.error(error);

        alert("Errore caricamento weekend.json");

    }

}
/* ==========================================================
   FORMAT DATA
========================================================== */

function formatDateTimeLocal(value){

    if(!value) return "";

    return value.substring(0,16);

}
/* ==========================================================
   PULSANTE CARICA WEEKEND
========================================================== */

document
.getElementById("loadWeekend")
.addEventListener(

    "click",

    loadWeekend

);
