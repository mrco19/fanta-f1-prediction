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
/* ==========================================================
   CARICA RESULTS.JSON
========================================================== */

async function loadResults(){

    try{

        const response = await fetch("results.json");

        if(!response.ok){

            throw new Error("results.json non trovato");

        }

        const results = await response.json();

        fillSession("aq", results.qualifying);
        fillSession("asq", results.sprintQualifying);
        fillSession("asr", results.sprint);
        fillSession("ar", results.race);

        console.log("✅ Results caricati");

    }

    catch(error){

        console.error(error);

        alert("Errore caricamento results.json");

    }

}
/* ==========================================================
   RIEMPI UNA SESSIONE
========================================================== */

function fillSession(prefix,list){

    if(!Array.isArray(list)) return;

    list.forEach((driver,index)=>{

        const select = document.getElementById(

            prefix+(index+1)

        );

        if(select){

            select.value = driver;

        }

    });

}
/* ==========================================================
   PULSANTE CARICA RESULTS
========================================================== */

document

.getElementById("loadResults")

.addEventListener(

    "click",

    loadResults

);
/* ==========================================================
   CREA OGGETTO RESULTS
========================================================== */

function buildResultsJSON(){

    return{

        qualifying:
            getSessionValues("aq",5),

        sprintQualifying:
            getSessionValues("asq",5),

        sprint:
            getSessionValues("asr",8),

        race:
            getSessionValues("ar",10)

    };

}
/* ==========================================================
   LEGGE UNA SESSIONE
========================================================== */

function getSessionValues(prefix,total){

    const array=[];

    for(let i=1;i<=total;i++){

        const value=

            document

            .getElementById(prefix+i)

            ?.value

            || "";

        if(value!==""){

            array.push(value);

        }

    }

    return array;

}
/* ==========================================================
   SALVA RESULTS.JSON
========================================================== */

function saveResults(){

    const results=buildResultsJSON();

    const json=JSON.stringify(

        results,

        null,

        2

    );

    const blob=new Blob(

        [json],

        {

            type:"application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const link=

        document.createElement("a");

    link.href=url;

    link.download="results.json";

    link.click();

    URL.revokeObjectURL(url);

    console.log("✅ results.json creato");

}
/* ==========================================================
   PULSANTE SALVA RESULTS
========================================================== */

document

.getElementById("saveResults")

.addEventListener(

    "click",

    saveResults

);
/* ==========================================================
   CREA RIGA CLASSIFICA
========================================================== */

function createRankingRow(name="",points=""){

    return `

    <div class="ranking-row">

        <input

            class="player-name"

            placeholder="Nome"

            value="${name}"

        >

        <input

            class="player-points"

            type="number"

            placeholder="Punti"

            value="${points}"

        >

        <button

            class="remove-player">

            ✖

        </button>

    </div>

    `;

}
/* ==========================================================
   AGGIUNGE GIOCATORE
========================================================== */

function addPlayerRow(name="",points=""){

    const container=

        document.getElementById("rankingEditor");

    container.insertAdjacentHTML(

        "beforeend",

        createRankingRow(name,points)

    );

    updateRemoveButtons();

}
/* ==========================================================
   ELIMINA GIOCATORE
========================================================== */

function updateRemoveButtons(){

    document

    .querySelectorAll(".remove-player")

    .forEach(button=>{

        button.onclick=()=>{

            button.parentElement.remove();

        };

    });

}

document

.getElementById("addPlayer")

.addEventListener(

    "click",

    ()=>{

        addPlayerRow();

    }

);
/* ==========================================================
   CARICA RANKING.JSON
========================================================== */

async function loadRanking(){

    try{

        const response = await fetch("ranking.json");

        if(!response.ok){

            throw new Error("ranking.json non trovato");

        }

        const ranking = await response.json();

        const container =

            document.getElementById("rankingEditor");

        container.innerHTML = "";

        ranking.forEach(player=>{

            addPlayerRow(

                player.name,

                player.points

            );

        });

        console.log("✅ Classifica caricata");

    }

    catch(error){

        console.error(error);

        alert("Errore caricamento ranking.json");

    }

}
/* ==========================================================
   CREA RANKING.JSON
========================================================== */

function buildRankingJSON(){

    const players = [];

    document

    .querySelectorAll(".ranking-row")

    .forEach(row=>{

        const name =

            row.querySelector(".player-name")

            .value

            .trim();

        const points =

            Number(

                row.querySelector(".player-points")

                .value

            );

        if(name!==""){

            players.push({

                name,

                points

            });

        }

    });

    players.sort(

        (a,b)=>b.points-a.points

    );

    return players;

}
/* ==========================================================
   SALVA RANKING.JSON
========================================================== */

function saveRanking(){

    const ranking = buildRankingJSON();

    const json = JSON.stringify(

        ranking,

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

    link.download = "ranking.json";

    link.click();

    URL.revokeObjectURL(url);

    console.log("✅ ranking.json creato");

}
/* ==========================================================
   PULSANTI CLASSIFICA
========================================================== */

document

.getElementById("loadRanking")

.addEventListener(

    "click",

    loadRanking

);

document

.getElementById("saveRanking")

.addEventListener(

    "click",

    saveRanking

);
/* ==========================================================
   CALENDARIO F1 2026
========================================================== */

const CALENDAR = [

{
    round:13,
    name:"Gran Premio del Belgio",
    country:"Belgio",
    circuit:"Spa-Francorchamps",
    flag:"🇧🇪",
    sprint:true
},

{
    round:14,
    name:"Gran Premio d'Ungheria",
    country:"Ungheria",
    circuit:"Hungaroring",
    flag:"🇭🇺",
    sprint:false
},

{
    round:15,
    name:"Gran Premio d'Olanda",
    country:"Paesi Bassi",
    circuit:"Zandvoort",
    flag:"🇳🇱",
    sprint:false
},

{
    round:16,
    name:"Gran Premio d'Italia",
    country:"Italia",
    circuit:"Monza",
    flag:"🇮🇹",
    sprint:false
},

{
    round:17,
    name:"Gran Premio dell'Azerbaijan",
    country:"Azerbaijan",
    circuit:"Baku",
    flag:"🇦🇿",
    sprint:false
},

{
    round:18,
    name:"Gran Premio di Singapore",
    country:"Singapore",
    circuit:"Marina Bay",
    flag:"🇸🇬",
    sprint:false
}

];
/* ==========================================================
   CERCA GP SUCCESSIVO
========================================================== */

function getNextWeekend(currentRound){

    return CALENDAR.find(

        gp=>gp.round===currentRound+1

    );

}
/* ==========================================================
   PREPARA GP SUCCESSIVO
========================================================== */

function prepareNextWeekend(){

    const currentRound = Number(

        document.getElementById("gpRoundInput").value

    );

    const next = getNextWeekend(currentRound);

    if(!next){

        alert("Calendario terminato.");

        return;

    }

    document.getElementById("gpNameInput").value =
        next.name;

    document.getElementById("gpCountryInput").value =
        next.country;

    document.getElementById("gpCircuitInput").value =
        next.circuit;

    document.getElementById("gpFlagInput").value =
        next.flag;

    document.getElementById("gpRoundInput").value =
        next.round;

    document.getElementById("gpSprintInput").value =
        next.sprint ? "true" : "false";

   clearResults();

   alert(

   "Weekend aggiornato.\n\nI risultati sono stati azzerati.\nInserisci le nuove date e salva il weekend."

    );

  }
/* ==========================================================
   PULSANTE PROSSIMO GP
========================================================== */

document

.getElementById("nextWeekend")

.addEventListener(

    "click",

    prepareNextWeekend

);
/* ==========================================================
   AZZERA RESULTS
========================================================== */

function clearResults(){

    clearSession("aq",5);

    clearSession("asq",5);

    clearSession("asr",8);

    clearSession("ar",10);

}
/* ==========================================================
   AZZERA UNA SESSIONE
========================================================== */

function clearSession(prefix,total){

    for(let i=1;i<=total;i++){

        const select=document.getElementById(prefix+i);

        if(select){

            select.value="";

        }

    }

}
<section id="settings" class="page">

    <h2>Impostazioni</h2>

/* ==========================================================
   PULSANTE GENERA TUTTO
========================================================== */

document

.getElementById("generateAll")

.addEventListener(

    "click",

    generateAllJSON

);
