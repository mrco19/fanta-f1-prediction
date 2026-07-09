"use strict";

/* ==========================================================
   FANTA F1 PREDICTION
   SCRIPT.JS
   Versione 3.0
========================================================== */

/* ==========================================================
   FILE JSON
========================================================== */

const CONFIG = {

    weekendFile: "weekend.json",

    resultsFile: "results.json",

    rankingFile: "ranking.json",

    perfectRaceBonus: 20,

    perfectWeekendBonus: 50

};

/* ==========================================================
   STATO APPLICAZIONE
========================================================== */

const APP = {

    weekend: null,

    results: {

        qualifying: [],

        sprintQualifying: [],

        sprint: [],

        race: []

    },

    ranking: [],

    countdownTimer: null

};

/* ==========================================================
   ELENCO PILOTI
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
   TABELLE PUNTEGGI
========================================================== */

const POINTS = {

    qualifying: {

        exact: [10,8,6,4,2],

        bonus: 1

    },

    sprintQualifying: {

        exact: [10,8,6,4,2],

        bonus: 1

    },

    sprintRace: {

        exact: [8,7,6,5,4,3,2,1],

        bonus: 1

    },

    race: {

        exact: [25,18,15,12,10,8,6,4,2,1],

        bonus: 2

    }

};
/* ==========================================================
   CACHE DOM
========================================================== */

const DOM = {

    /* pannelli */

    panels:
        document.querySelectorAll(".panel"),

    /* menu */

    menuToggle:
        document.getElementById("menuToggle"),

    sideMenu:
        document.getElementById("sideMenu"),

    /* home */

    gpName:
        document.getElementById("gpName"),

    gpCardName:
        document.getElementById("gpCardName"),

    gpCircuit:
        document.getElementById("gpCircuit"),

    gpDate:
        document.getElementById("gpDate"),

    weekendType:
        document.getElementById("weekendType"),

    gpStatus:
        document.getElementById("gpStatus"),

    gpCardWeekend:
        document.getElementById("gpCardWeekend"),

    gpCardStatus:
        document.getElementById("gpCardStatus"),

    countdown:
        document.getElementById("countdown"),

    leader:
        document.getElementById("leader"),

    leaderPoints:
        document.getElementById("leaderPoints"),

    totalGP:
        document.getElementById("totalGP"),

    lastWinner:
        document.getElementById("lastWinner"),

    lastPole:
        document.getElementById("lastPole"),

    totalScore:
        document.getElementById("totalScore")

};

/* ==========================================================
   CONTENITORI SESSIONI
========================================================== */

const CONTAINERS = {

    qualifyingPrediction:

        document.getElementById("quali-predictions"),

    qualifyingResult:

        document.getElementById("quali-results"),

    sprintQualifyingPrediction:

        document.getElementById("sprintquali-predictions"),

    sprintQualifyingResult:

        document.getElementById("sprintquali-results"),

    sprintPrediction:

        document.getElementById("sprint-predictions"),

    sprintResult:

        document.getElementById("sprint-results"),

    racePrediction:

        document.getElementById("race-predictions"),

    raceResult:

        document.getElementById("race-results")

};

/* ==========================================================
   UTILITY
========================================================== */

function $(id){

    return document.getElementById(id);

}

function setText(id,value){

    const element=$(id);

    if(element){

        element.textContent=value;

    }

}

function setHTML(id,value){

    const element=$(id);

    if(element){

        element.innerHTML=value;

    }

}

/* ==========================================================
   CREA OPZIONI PILOTI
========================================================== */

function createDriverOptions(){

    return [

        `<option value="">Seleziona pilota</option>`,

        ...DRIVERS.map(driver=>

            `<option value="${driver}">${driver}</option>`

        )

    ].join("");

}
/* ==========================================================
   CONFIGURAZIONE TABELLE
========================================================== */

const TABLES = [

    {

        predictionContainer: CONTAINERS.qualifyingPrediction,

        resultContainer: CONTAINERS.qualifyingResult,

        predictionPrefix: "qp",

        resultPrefix: "qr",

        positions: 5

    },

    {

        predictionContainer: CONTAINERS.sprintQualifyingPrediction,

        resultContainer: CONTAINERS.sprintQualifyingResult,

        predictionPrefix: "sqp",

        resultPrefix: "sqr",

        positions: 5

    },

    {

        predictionContainer: CONTAINERS.sprintPrediction,

        resultContainer: CONTAINERS.sprintResult,

        predictionPrefix: "sp",

        resultPrefix: "sr",

        positions: 8

    },

    {

        predictionContainer: CONTAINERS.racePrediction,

        resultContainer: CONTAINERS.raceResult,

        predictionPrefix: "rp",

        resultPrefix: "rr",

        positions: 10

    }

];

/* ==========================================================
   CREA TABELLA PRONOSTICI
========================================================== */

function createPredictionTable(config){

    if(!config.predictionContainer) return;

    const options = createDriverOptions();

    let html = "";

    for(let i=1;i<=config.positions;i++){

        html += `

            <div class="input-row">

                <span>${i}°</span>

                <select
                    id="${config.predictionPrefix}${i}"
                    class="driver-select">

                    ${options}

                </select>

            </div>

        `;

    }

    config.predictionContainer.innerHTML = html;

}

/* ==========================================================
   CREA TABELLA RISULTATI
========================================================== */

function createResultTable(config){

    if(!config.resultContainer) return;

    let html = "";

    for(let i=1;i<=config.positions;i++){

        html += `

            <div class="result-row">

                <span
                    id="${config.resultPrefix}Pos${i}">

                    ${i}°

                </span>

                <input
                    id="${config.resultPrefix}${i}"
                    class="result-field"
                    readonly>

            </div>

        `;

    }

    config.resultContainer.innerHTML = html;

}

/* ==========================================================
   COSTRUZIONE COMPLETA PAGINA PRONOSTICI
========================================================== */

function buildPredictionTables(){

    TABLES.forEach(config=>{

        createPredictionTable(config);

        createResultTable(config);

    });

}
/* ==========================================================
   RECUPERA LE SELECT DI UNA SESSIONE
========================================================== */

function getSessionSelects(container){

    if(!container) return [];

    return Array.from(

        container.querySelectorAll(".driver-select")

    );

}

/* ==========================================================
   AGGIORNA BLOCCO PILOTI DUPLICATI
========================================================== */

function updateDriverLocks(container){

    const selects = getSessionSelects(container);

    if(selects.length===0) return;

    /* ---------------------------------
       SBLOCCA TUTTE LE OPZIONI
    --------------------------------- */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            option.disabled = false;

        });

    });

    /* ---------------------------------
       PILOTI GIÀ SELEZIONATI
    --------------------------------- */

    const selectedDrivers =

        selects

            .map(select=>select.value)

            .filter(driver=>driver !== "");

    /* ---------------------------------
       DISABILITA I DUPLICATI
    --------------------------------- */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            if(option.value==="") return;

            if(

                selectedDrivers.includes(option.value)

                &&

                option.value!==select.value

            ){

                option.disabled = true;

            }

        });

    });

}

/* ==========================================================
   ATTIVA IL BLOCCO DUPLICATI
========================================================== */

function initializeDriverLocks(){

    TABLES.forEach(config=>{

        const selects = getSessionSelects(

            config.predictionContainer

        );

        selects.forEach(select=>{

            select.addEventListener(

                "change",

                ()=>{

                    updateDriverLocks(

                        config.predictionContainer

                    );

                }

            );

        });

        updateDriverLocks(

            config.predictionContainer

        );

    });

}
/* ==========================================================
   CARICAMENTO FILE JSON
========================================================== */

async function loadJSON(file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(

                `Errore caricamento ${file}`

            );

        }

        return await response.json();

    }

    catch(error){

        console.error(error);

        return null;

    }

}

/* ==========================================================
   CARICA TUTTI I DATI
========================================================== */

async function loadAllData(){

    const [

        weekend,

        results,

        ranking

    ] = await Promise.all([

        loadJSON(CONFIG.weekendFile),

        loadJSON(CONFIG.resultsFile),

        loadJSON(CONFIG.rankingFile)

    ]);

    /* --------------------------
       WEEKEND
    -------------------------- */

    APP.weekend = weekend || {

        name: "",

        circuit: "",

        date: "",

        sprint: false,

        round: "",

        closePrediction: ""

    };

    /* --------------------------
       RISULTATI
    -------------------------- */

    APP.results = results || {

        qualifying: [],

        sprintQualifying: [],

        sprint: [],

        race: []

    };

    /* --------------------------
       CLASSIFICA
    -------------------------- */

    APP.ranking = ranking || [];

}
