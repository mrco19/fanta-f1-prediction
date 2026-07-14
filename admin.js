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
