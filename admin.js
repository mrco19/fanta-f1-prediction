/* ==========================================
   FANTA F1 PREDICTION
   ADMIN PANEL
   Versione 3.0
========================================== */

"use strict";

/* ==========================================
   OPENF1
========================================== */

const API_BASE = "https://api.openf1.org/v1";

let currentMeeting = null;
let gpDate = null;

/* ==========================================
   PILOTI
========================================== */

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

/* ==========================================
   CONFIGURAZIONE TABELLE
========================================== */

const TABLES=[

    {

        predictionContainer:"quali-predictions",

        resultContainer:"quali-results",

        predictionPrefix:"qp",

        resultPrefix:"qr",

        positions:5,

        scoreId:"qualiScore",

        detailId:"qualiDetail",

        exactPoints:[10,8,6,4,2],

        bonus:1

    },

    {

        predictionContainer:"sprintquali-predictions",

        resultContainer:"sprintquali-results",

        predictionPrefix:"sqp",

        resultPrefix:"sqr",

        positions:5,

        scoreId:"sprintQualiScore",

        detailId:"sprintQualiDetail",

        exactPoints:[10,8,6,4,2],

        bonus:1

    },

    {

        predictionContainer:"sprint-predictions",

        resultContainer:"sprint-results",

        predictionPrefix:"sp",

        resultPrefix:"sr",

        positions:8,

        scoreId:"sprintRaceScore",

        detailId:"sprintRaceDetail",

        exactPoints:[8,7,6,5,4,3,2,1],

        bonus:1

    },

    {

        predictionContainer:"race-predictions",

        resultContainer:"race-results",

        predictionPrefix:"rp",

        resultPrefix:"rr",

        positions:10,

        scoreId:"raceScore",

        detailId:"raceDetail",

        exactPoints:[25,18,15,12,10,8,6,4,2,1],

        bonus:2

    }

];

/* ==========================================
   CACHE DOM
========================================== */

const DOM={

    totalScore:

        document.getElementById("totalScore"),

    gpName:

        document.getElementById("gpName"),

    gpCircuit:

        document.getElementById("gpCircuit"),

    gpDate:

        document.getElementById("gpDate"),

    countdown:

        document.getElementById("countdown"),

    weekendType:

        document.getElementById("weekendType"),

    gpCardStatus:

        document.getElementById("gpCardStatus"),

    jsonOutput:

        document.getElementById("jsonOutput")

};
/* ==========================================
   CREAZIONE TABELLE
========================================== */

function createPredictionTable(config){

    const container = document.getElementById(
        config.predictionContainer
    );

    if(!container) return;

    const options =

        `<option value="">Seleziona pilota</option>` +

        DRIVERS.map(driver =>

            `<option value="${driver}">${driver}</option>`

        ).join("");

    let html = "";

    for(let i = 1; i <= config.positions; i++){

        html += `

            <div class="input-row">

                <span>${i}°</span>

                <select

                    id="${config.predictionPrefix}${i}"

                    class="driver-select"

                >

                    ${options}

                </select>

            </div>

        `;

    }

    container.innerHTML = html;

}

/* ==========================================
   TABELLA RISULTATI
========================================== */

function createResultsTable(config){

    const container = document.getElementById(
        config.resultContainer
    );

    if(!container) return;

    let html = "";

    for(let i = 1; i <= config.positions; i++){

        html += `

            <div class="result-row">

                <span

                    id="${config.resultPrefix}Pos${i}"

                >

                    ${i}°

                </span>

                <input

                    id="${config.resultPrefix}${i}"

                    class="result-field"

                    readonly

                >

            </div>

        `;

    }

    container.innerHTML = html;

}

/* ==========================================
   COSTRUZIONE COMPLETA
========================================== */

function buildTables(){

    TABLES.forEach(config=>{

        createPredictionTable(config);

        createResultsTable(config);

    });

}
/* ==========================================
   RECUPERA LE SELECT
========================================== */

function getSelects(containerId){

    const container = document.getElementById(containerId);

    if(!container) return [];

    return Array.from(

        container.querySelectorAll(".driver-select")

    );

}

/* ==========================================
   AGGIORNA BLOCCO DUPLICATI
========================================== */

function updateDuplicateProtection(containerId){

    const selects = getSelects(containerId);

    /* Riabilita tutte le opzioni */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            option.disabled = false;

        });

    });

    /* Trova i piloti già scelti */

    const selectedDrivers = selects

        .map(select=>select.value)

        .filter(driver=>driver !== "");

    /* Disabilita i duplicati */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            if(option.value==="") return;

            if(

                selectedDrivers.includes(option.value) &&

                option.value !== select.value

            ){

                option.disabled = true;

            }

        });

    });

}

/* ==========================================
   INIZIALIZZA PROTEZIONE
========================================== */

function initializeDuplicateProtection(){

    TABLES.forEach(config=>{

        const selects = getSelects(

            config.predictionContainer

        );

        selects.forEach(select=>{

            select.addEventListener(

                "change",

                ()=>{

                    updateDuplicateProtection(

                        config.predictionContainer

                    );

                }

            );

        });

        updateDuplicateProtection(

            config.predictionContainer

        );

    });

}
/* ==========================================
   CARICAMENTO RESULTS.JSON
========================================== */

async function loadResults(){

    try{

        const response = await fetch("results.json");

        if(!response.ok){

            throw new Error("results.json non trovato");

        }

        const data = await response.json();

        applyResults(data);

        console.log("✅ Risultati caricati");

    }

    catch(error){

        console.error("Errore caricamento risultati:", error);

    }

}

/* ==========================================
   APPLICA RISULTATI
========================================== */

function applyResults(data){

    const sections=[

        {

            json:data.qualifying,

            prefix:"qr"

        },

        {

            json:data.sprintQualifying,

            prefix:"sqr"

        },

        {

            json:data.sprint,

            prefix:"sr"

        },

        {

            json:data.race,

            prefix:"rr"

        }

    ];

    sections.forEach(section=>{

        if(!section.json) return;

        section.json.forEach((driver,index)=>{

            const input=document.getElementById(

                `${section.prefix}${index+1}`

            );

            const position=document.getElementById(

                `${section.prefix}Pos${index+1}`

            );

            if(input){

                input.value=driver;

            }

            if(position){

                switch(index){

                    case 0:

                        position.textContent="🏆 1°";

                        break;

                    case 1:

                        position.textContent="🥈 2°";

                        break;

                    case 2:

                        position.textContent="🥉 3°";

                        break;

                    default:

                        position.textContent=`${index+1}°`;

                        break;

                }

            }

        });

    });

}
/* ==========================================
   CALCOLO PUNTEGGIO
========================================== */

function calculateScore(config){

    let total = 0;

    let detail = "";

    const predictions = [];

    const results = [];

    /* Legge pronostici */

    for(let i=1;i<=config.positions;i++){

        predictions.push(

            document

                .getElementById(`${config.predictionPrefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    /* Legge risultati */

    for(let i=1;i<=config.positions;i++){

        results.push(

            document

                .getElementById(`${config.resultPrefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    /* Confronto */

    predictions.forEach((driver,index)=>{

        if(driver==="") return;

        /* Posizione esatta */

        if(driver===results[index]){

            const points =

                config.exactPoints[index] || 0;

            total += points;

            detail +=

                `🏁 ${index+1}° ${driver} +${points}<br>`;

            return;

        }

        /* Pilota presente */

        if(results.includes(driver)){

            total += config.bonus;

            detail +=

                `✔ ${driver} +${config.bonus}<br>`;

            return;

        }

        /* Nessun punto */

        detail +=

            `✖ ${driver} +0<br>`;

    });

    /* Aggiorna HTML */

    const scoreElement =

        document.getElementById(config.scoreId);

    if(scoreElement){

        scoreElement.textContent =

            `${total} punti`;

    }

    const detailElement =

        document.getElementById(config.detailId);

    if(detailElement){

        detailElement.innerHTML = detail;

    }

    return total;

}

/* ==========================================
   CALCOLA TUTTO
========================================== */

function calculateAllScores(){

    let weekendTotal = 0;

    TABLES.forEach(config=>{

        weekendTotal += calculateScore(config);

    });

    if(DOM.totalScore){

        DOM.totalScore.textContent =

            `Totale Weekend: ${weekendTotal} punti`;

    }

}
/* ==========================================
   COLLEGAMENTO PULSANTI
========================================== */

function initializeButtons(){

    const buttonMap={

        qp:"calculateQuali",

        sqp:"calculateSprintQuali",

        sp:"calculateSprintRace",

        rp:"calculateRace"

    };

    TABLES.forEach(config=>{

        const buttonId=

            buttonMap[config.predictionPrefix];

        const button=document.getElementById(buttonId);

        if(!button) return;

        button.addEventListener("click",()=>{

            calculateScore(config);

        });

    });

}

/* ==========================================
   BOTTONE TOTALE WEEKEND
========================================== */

function initializeTotalButton(){

    const button=document.getElementById(

        "calculateTotal"

    );

    if(!button) return;

    button.addEventListener(

        "click",

        calculateAllScores

    );

}
/* ==========================================
   COSTRUZIONE RESULTS.JSON
========================================== */

function getResultsArray(prefix,total){

    const results=[];

    for(let i=1;i<=total;i++){

        results.push(

            document

                .getElementById(`${prefix}${i}`)

                ?.value || ""

        );

    }

    return results;

}

function buildResultsJSON(){

    return{

        qualifying:

            getResultsArray("qr",5),

        sprintQualifying:

            getResultsArray("sqr",5),

        sprint:

            getResultsArray("sr",8),

        race:

            getResultsArray("rr",10)

    };

}

/* ==========================================
   GENERA JSON
========================================== */

function exportJSON(){

    const json = JSON.stringify(

        buildResultsJSON(),

        null,

        2

    );

    if(DOM.jsonOutput){

        DOM.jsonOutput.value = json;

    }

}

/* ==========================================
   COPIA JSON
========================================== */

async function copyJSON(){

    if(!DOM.jsonOutput) return;

    try{

        await navigator.clipboard.writeText(

            DOM.jsonOutput.value

        );

        alert("✅ JSON copiato negli appunti.");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   DOWNLOAD JSON
========================================== */

function downloadJSON(){

    if(!DOM.jsonOutput) return;

    const blob = new Blob(

        [DOM.jsonOutput.value],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "results.json";

    link.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
   PULSANTI JSON
========================================== */

function initializeJSONButtons(){

    document

        .getElementById("generateJSON")

        ?.addEventListener(

            "click",

            exportJSON

        );

    document

        .getElementById("copyJSON")

        ?.addEventListener(

            "click",

            copyJSON

        );

    document

        .getElementById("downloadJSON")

        ?.addEventListener(

            "click",

            downloadJSON

        );

}
/* ==========================================
   OPENF1
========================================== */

async function loadWeekendData(){

    try{

        const response = await fetch(

            `${API_BASE}/meetings?year=2026`

        );

        const meetings = await response.json();

        if(!Array.isArray(meetings)) return;

        const now = new Date();

        currentMeeting = meetings.find(meeting=>

            new Date(meeting.date_start) > now

        );

        if(!currentMeeting){

            console.warn("Nessun GP trovato.");

            return;

        }

        gpDate = new Date(currentMeeting.date_start);

        updateDashboard();

    }

    catch(error){

        console.error(

            "Errore OpenF1:",

            error

        );

    }

}

/* ==========================================
   DASHBOARD
========================================== */

function updateDashboard(){

    if(!currentMeeting) return;

    if(DOM.gpName){

        DOM.gpName.textContent =

            `${currentMeeting.country_name} ${currentMeeting.meeting_name}`;

    }

    if(DOM.gpCircuit){

        DOM.gpCircuit.textContent =

            currentMeeting.circuit_short_name;

    }

    if(DOM.gpDate){

        DOM.gpDate.textContent =

            gpDate.toLocaleDateString(

                "it-IT",

                {

                    day:"numeric",

                    month:"long",

                    year:"numeric"

                }

            );

    }

    if(DOM.weekendType){

        DOM.weekendType.textContent =

            currentMeeting.meeting_name.includes("Sprint")

            ? "Weekend Sprint"

            : "Weekend Normale";

    }

    if(DOM.gpCardStatus){

        DOM.gpCardStatus.textContent =

            "🟢 Pronostici aperti";

    }

    updateCountdown();

}

/* ==========================================
   COUNTDOWN
========================================== */

function updateCountdown(){

    if(!gpDate) return;

    if(!DOM.countdown) return;

    const now = new Date();

    const diff = gpDate - now;

    if(diff <= 0){

        DOM.countdown.textContent =

            "Weekend iniziato";

        return;

    }

    const days = Math.floor(

        diff / (1000*60*60*24)

    );

    const hours = Math.floor(

        (diff % (1000*60*60*24))

        /

        (1000*60*60)

    );

    const minutes = Math.floor(

        (diff % (1000*60*60))

        /

        (1000*60)

    );

    DOM.countdown.textContent =

        `${days}g ${hours}h ${minutes}m`;

}

/* ==========================================
   TIMER
========================================== */

setInterval(

    updateCountdown,

    60000

);

/* ==========================================
   API
========================================== */

async function initAPI(){

    await loadWeekendData();

}
/* ==========================================
   NAVIGAZIONE PANNELLI
========================================== */

function showSection(sectionId){

    document

        .querySelectorAll(".panel")

        .forEach(panel=>{

            panel.style.display="none";

        });

    const target=document.getElementById(sectionId);

    if(target){

        target.style.display="block";

    }

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================================
   MENU LATERALE
========================================== */

function initializeMenu(){

    const buttons=document.querySelectorAll(

        ".sidebar button"

    );

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>

                btn.classList.remove("active")

            );

            button.classList.add("active");

        });

    });

    if(buttons.length){

        buttons[0].classList.add("active");

    }

}
/* ==========================================
   INIZIALIZZAZIONE
========================================== */

async function initAdmin(){

    console.log("🚀 Avvio Admin...");

    /* Costruisce tutte le tabelle */

    buildTables();

    /* Protezione piloti duplicati */

    initializeDuplicateProtection();

    /* Pulsanti punteggi */

    initializeButtons();

    initializeTotalButton();

    /* Pulsanti JSON */

    initializeJSONButtons();

    /* Carica results.json */

    await loadResults();

    /* Dashboard OpenF1 */

    await initAPI();

    /* Menu laterale */

    initializeMenu();

    console.log("✅ Admin pronto");

}

/* ==========================================
   AVVIO APPLICAZIONE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initAdmin();

    }

);
