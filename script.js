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
/* ==========================================================
   AGGIORNA HOME
========================================================== */

function updateHome(){

    if(!APP.weekend) return;

    /* --------------------------
       GP
    -------------------------- */

    setText(

        "gpName",

        APP.weekend.name

    );

    setText(

        "gpCardName",

        APP.weekend.name

    );

    /* --------------------------
       CIRCUITO
    -------------------------- */

    setText(

        "gpCircuit",

        APP.weekend.circuit

    );

    /* --------------------------
       DATA
    -------------------------- */

    setText(

        "gpDate",

        APP.weekend.date

    );

    /* --------------------------
       WEEKEND
    -------------------------- */

    const weekendType =

        APP.weekend.sprint

            ? "Weekend Sprint"

            : "Weekend Normale";

    setText(

        "weekendType",

        weekendType

    );

    setText(

        "gpCardWeekend",

        weekendType

    );

    /* --------------------------
       STATO
    -------------------------- */

    const status = getWeekendStatus();

    setText(

        "gpStatus",

        status

    );

    setText(

        "gpCardStatus",

        status

    );

    /* --------------------------
       LEADER
    -------------------------- */

    if(APP.ranking.length>0){

        setText(

            "leader",

            APP.ranking[0].name

        );

        setText(

            "leaderPoints",

            APP.ranking[0].points

        );

    }

    /* --------------------------
       ULTIMO GP
    -------------------------- */

    if(APP.results.race.length>0){

        setText(

            "lastWinner",

            APP.results.race[0]

        );

    }

    if(APP.results.qualifying.length>0){

        setText(

            "lastPole",

            APP.results.qualifying[0]

        );

    }

    /* --------------------------
       NUMERO GP
    -------------------------- */

    setText(

        "totalGP",

        APP.weekend.round

    );

    /* --------------------------
       COUNTDOWN
    -------------------------- */

    startCountdown();

}

/* ==========================================================
   STATO WEEKEND
========================================================== */

function getWeekendStatus(){

    if(!APP.weekend){

        return "Caricamento...";

    }

    const now = new Date();

    const close =

        new Date(

            APP.weekend.closePrediction

        );

    if(now<close){

        return "🟢 Pronostici aperti";

    }

    return "🔴 Pronostici chiusi";

}

/* ==========================================================
   COUNTDOWN
========================================================== */

function startCountdown(){

    if(!APP.weekend) return;

    if(APP.countdownTimer){

        clearInterval(

            APP.countdownTimer

        );

    }

    function update(){

        const now = new Date();

        const target =

            new Date(

                APP.weekend.closePrediction

            );

        const diff = target-now;

        if(diff<=0){

            setText(

                "countdown",

                "Weekend iniziato"

            );

            return;

        }

        const days =

            Math.floor(

                diff/(1000*60*60*24)

            );

        const hours =

            Math.floor(

                (

                    diff%(1000*60*60*24)

                )

                /

                (1000*60*60)

            );

        const minutes =

            Math.floor(

                (

                    diff%(1000*60*60)

                )

                /

                (1000*60)

            );

        setText(

            "countdown",

            `${days}g ${hours}h ${minutes}m`

        );

    }

    update();

    APP.countdownTimer =

        setInterval(

            update,

            60000

        );

}
/* ==========================================================
   INIZIALIZZAZIONE APPLICAZIONE
========================================================== */

async function initializeApplication(){

    try{

        console.log(

            "🏁 Avvio Fanta F1 Prediction..."

        );

        /* --------------------------
           CARICA FILE JSON
        -------------------------- */

        await loadAllData();

        /* --------------------------
           CREA LE TABELLE
        -------------------------- */

        buildPredictionTables();

        /* --------------------------
           BLOCCO DUPLICATI
        -------------------------- */

        initializeDriverLocks();

        /* --------------------------
           CARICA RESULTS.JSON
        -------------------------- */

        updateResultsPage();

        /* --------------------------
           HOME
        -------------------------- */

        updateHome();

        /* --------------------------
           MENU HAMBURGER
        -------------------------- */

        initializeMenu();

        initializeOutsideClick();

        /* --------------------------
           MOSTRA HOME
        -------------------------- */

        showSection("home");

        console.log(

            "✅ Applicazione pronta."

        );

    }

    catch(error){

        console.error(

            "Errore durante l'avvio:",

            error

        );

    }

}

/* ==========================================================
   AVVIO PAGINA
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);
/* ==========================================================
   CALCOLO GENERICO SESSIONE
========================================================== */

function calculateSession(config){

    const predictions = [];
    const results = [];

    let total = 0;
    let detail = "";

    /* --------------------------
       LEGGE PRONOSTICI
    -------------------------- */

    for(let i=1;i<=config.positions;i++){

        predictions.push(

            $(`${config.predictionPrefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    /* --------------------------
       LEGGE RISULTATI
    -------------------------- */

    for(let i=1;i<=config.positions;i++){

        results.push(

            $(`${config.resultPrefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    /* --------------------------
       CONFRONTO
    -------------------------- */

    predictions.forEach((driver,index)=>{

        if(driver===""){

            detail += `${index+1}° — nessun pronostico<br>`;

            return;

        }

        /* posizione esatta */

        if(driver===results[index]){

            const pts =

                config.points[index+1] || 0;

            total += pts;

            detail +=

                `🏆 ${index+1}° ${driver} +${pts}<br>`;

            return;

        }

        /* pilota presente */

        if(results.includes(driver)){

            total += config.bonus;

            detail +=

                `✔ ${driver} +${config.bonus}<br>`;

            return;

        }

        detail +=

            `✖ ${driver} +0<br>`;

    });

    $(config.scoreId).textContent =

        `${total} punti`;

    $(config.detailId).innerHTML =

        detail;

    return total;

}

/* ==========================================================
   QUALIFICHE
========================================================== */

function calculateQualifying(){

    return calculateSession({

        predictionPrefix:"qp",

        resultPrefix:"qr",

        positions:5,

        points:POINTS.qualifying,

        bonus:POINTS.qualifying.wrong,

        scoreId:"qualiScore",

        detailId:"qualiDetail"

    });

}

/* ==========================================================
   SPRINT QUALIFYING
========================================================== */

function calculateSprintQualifying(){

    return calculateSession({

        predictionPrefix:"sqp",

        resultPrefix:"sqr",

        positions:5,

        points:POINTS.sprintQualifying,

        bonus:POINTS.sprintQualifying.wrong,

        scoreId:"sprintQualiScore",

        detailId:"sprintQualiDetail"

    });

}

/* ==========================================================
   SPRINT RACE
========================================================== */

function calculateSprintRace(){

    return calculateSession({

        predictionPrefix:"sp",

        resultPrefix:"sr",

        positions:8,

        points:POINTS.sprintRace,

        bonus:POINTS.sprintRace.wrong,

        scoreId:"sprintRaceScore",

        detailId:"sprintRaceDetail"

    });

}

/* ==========================================================
   GARA
========================================================== */

function calculateRace(){

    return calculateSession({

        predictionPrefix:"rp",

        resultPrefix:"rr",

        positions:10,

        points:POINTS.race,

        bonus:POINTS.race.wrong,

        scoreId:"raceScore",

        detailId:"raceDetail"

    });

}
/* ==========================================================
   PERFECT RACE
========================================================== */

function hasPerfectRace(){

    const predictions = getPredictions("rp",10);

    const results = getResults("rr",10);

    if(

        predictions.includes("") ||

        results.includes("")

    ){

        return false;

    }

    return predictions.every(driver=>

        results.includes(driver)

    );

}

/* ==========================================================
   PERFECT WEEKEND
========================================================== */

function hasPerfectWeekend(){

    const perfectQualifying =

        getPredictions("qp",5)

            .every(driver=>

                getResults("qr",5)

                    .includes(driver)

            );

    const perfectRace =

        hasPerfectRace();

    if(

        !APP.weekend.sprint

    ){

        return (

            perfectQualifying &&

            perfectRace

        );

    }

    const perfectSprintQualifying =

        getPredictions("sqp",5)

            .every(driver=>

                getResults("sqr",5)

                    .includes(driver)

            );

    const perfectSprintRace =

        getPredictions("sp",8)

            .every(driver=>

                getResults("sr",8)

                    .includes(driver)

            );

    return(

        perfectQualifying &&

        perfectSprintQualifying &&

        perfectSprintRace &&

        perfectRace

    );

}

/* ==========================================================
   BONUS
========================================================== */

function calculateBonus(){

    let bonus = 0;

    if(

        hasPerfectRace()

    ){

        bonus += CONFIG.perfectRaceBonus;

    }

    if(

        hasPerfectWeekend()

    ){

        bonus += CONFIG.perfectWeekendBonus;

    }

    return bonus;

}

/* ==========================================================
   TOTALE WEEKEND
========================================================== */

function calculateWeekend(){

    let total = 0;

    total += calculateQualifying();

    if(

        APP.weekend.sprint

    ){

        total += calculateSprintQualifying();

        total += calculateSprintRace();

    }

    total += calculateRace();

    const bonus = calculateBonus();

    total += bonus;

    if(

        DOM.totalScore

    ){

        if(bonus>0){

            DOM.totalScore.innerHTML =

                `Totale Weekend<br><br>${total} punti<br>⭐ Bonus +${bonus}`;

        }

        else{

            DOM.totalScore.innerHTML =

                `Totale Weekend<br><br>${total} punti`;

        }

    }

    return total;

}
/* ==========================================================
   COLLEGAMENTO PULSANTI
========================================================== */

function initializeButtons(){

    $("calculateQuali")
    ?.addEventListener(

        "click",

        calculateQualifying

    );

    $("calculateSprintQuali")
    ?.addEventListener(

        "click",

        calculateSprintQualifying

    );

    $("calculateSprintRace")
    ?.addEventListener(

        "click",

        calculateSprintRace

    );

    $("calculateRace")
    ?.addEventListener(

        "click",

        calculateRace

    );

    $("calculateTotal")
    ?.addEventListener(

        "click",

        calculateWeekend

    );

}

/* ==========================================================
   CARICA RESULTS.JSON NELLE TABELLE
========================================================== */

function updateResultsPage(){

    if(!APP.results) return;

    fillResultSession({

        prefix:"qr",

        results:APP.results.qualifying

    });

    fillResultSession({

        prefix:"sqr",

        results:APP.results.sprintQualifying

    });

    fillResultSession({

        prefix:"sr",

        results:APP.results.sprint

    });

    fillResultSession({

        prefix:"rr",

        results:APP.results.race

    });

}

/* ==========================================================
   SCRIVE UNA SESSIONE
========================================================== */

function fillResultSession(config){

    if(!config.results) return;

    config.results.forEach((driver,index)=>{

        const input =

            $(`${config.prefix}${index+1}`);

        const position =

            $(`${config.prefix}Pos${index+1}`);

        if(input){

            input.value = driver;

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

}
/* ==========================================================
   CARICAMENTO COMPLETO APPLICAZIONE
========================================================== */

async function loadAllData(){

    await loadWeekend();

    await loadResults();

    await loadRanking();

}

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

async function initializeApplication(){

    try{

        console.log(

            "🏁 Avvio Fanta F1 Prediction..."

        );

        /* --------------------------
           CARICA FILE JSON
        -------------------------- */

        await loadAllData();

        /* --------------------------
           CREA TUTTE LE TABELLE
        -------------------------- */

        buildPredictionPage();

        /* --------------------------
           BLOCCA DUPLICATI
        -------------------------- */

        initializeDriverLocks();

        /* --------------------------
           CARICA RESULTS.JSON
        -------------------------- */

        updateResultsPage();

        /* --------------------------
           AGGIORNA HOME
        -------------------------- */

        updateHome();

        /* --------------------------
           NASCONDE O MOSTRA
           LE SESSIONI SPRINT
        -------------------------- */

        updateSprintVisibility();

        /* --------------------------
           MENU
        -------------------------- */

        initializeMenu();

        initializeOutsideClick();

        /* --------------------------
           PULSANTI
        -------------------------- */

        initializeButtons();

        /* --------------------------
           HOME
        -------------------------- */

        showSection("home");

        console.log(

            "✅ Applicazione pronta."

        );

    }

    catch(error){

        console.error(

            "Errore inizializzazione:",

            error

        );

    }

}

/* ==========================================================
   AVVIO
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);
