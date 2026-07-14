"use strict";

/* ==========================================================
   FANTA F1 PREDICTION
   ADMIN.JS
   Versione 1.0
========================================================== */
/* ==========================================================
   ELENCO PILOTI 2026
========================================================== */

const DRIVERS = [

    "Alexander ALBON",
    "Arvin LINDBLAD",
    "Carlos SAINZ",
    "Charles LECLERC",
    "Esteban OCON",
    "Fernando ALONSO",
    "Franco COLAPINTO",
    "Gabriel BORTOLETO",
    "George RUSSELL",
    "Isack HADJAR",
    "Kimi ANTONELLI",
    "Lando NORRIS",
    "Lance STROLL",
    "Lewis HAMILTON",
    "Liam LAWSON",
    "Max VERSTAPPEN",
    "Nico HULKENBERG",
    "Oliver BEARMAN",
    "Oscar PIASTRI",
    "Pierre GASLY",
    "Sergio PEREZ",
    "Valtteri BOTTAS"

].sort((a,b)=>a.localeCompare(b));
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
/* ==========================================================
   CREA OGGETTO WEEKEND
========================================================== */

function buildWeekendJSON(){

    return{

        id: Number(

            document.getElementById("gpRoundInput").value

        ),

        name:

            document.getElementById("gpNameInput").value,

        country:

            document.getElementById("gpCountryInput").value,

        circuit:

            document.getElementById("gpCircuitInput").value,

        flag:

            document.getElementById("gpFlagInput").value,

        round: Number(

            document.getElementById("gpRoundInput").value

        ),

        sprint:

            document.getElementById("gpSprintInput").value==="true",

        startDate:

            document.getElementById("gpStartInput").value,

        endDate:

            document.getElementById("gpEndInput").value,

        predictionsClose:

            document.getElementById("gpCloseInput").value

    };

}
/* ==========================================================
   SCARICA WEEKEND.JSON
========================================================== */

function saveWeekend(){

    const weekend = buildWeekendJSON();

    const json = JSON.stringify(

        weekend,

        null,

        2

    );

    const blob = new Blob(

        [json],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "weekend.json";

    link.click();

    URL.revokeObjectURL(url);

    console.log("✅ weekend.json creato");

}
/* ==========================================================
   PULSANTE SALVA WEEKEND
========================================================== */

document

.getElementById("saveWeekend")

.addEventListener(

    "click",

    saveWeekend

);
/* ==========================================================
   CREA SELECT PILOTI
========================================================== */

function createDriverSelect(id){

    let html=`<select id="${id}">`;

    html+=`<option value="">--</option>`;

    DRIVERS.forEach(driver=>{

        html+=`<option value="${driver}">${driver}</option>`;

    });

    html+=`</select>`;

    return html;

}
/* ==========================================================
   CREA TABELLE RESULTS
========================================================== */

function buildResultsPage(){

    createSession(

        "adminQualifying",

        "aq",

        5

    );

    createSession(

        "adminSprintQualifying",

        "asq",

        5

    );

    createSession(

        "adminSprintRace",

        "asr",

        8

    );

    createSession(

        "adminRace",

        "ar",

        10

    );

}
function createSession(container,prefix,total){

    const div=document.getElementById(container);

    let html="";

    for(let i=1;i<=total;i++){

        html+=`

        <div class="admin-row">

            <span>${i}°</span>

            ${createDriverSelect(prefix+i)}

        </div>

        `;

    }

    div.innerHTML=html;

}
/* ==========================================================
   COSTRUZIONE PAGINA RISULTATI
========================================================== */

buildResultsPage();
