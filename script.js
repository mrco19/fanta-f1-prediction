"use strict";

/* ==========================================================
   FANTA F1 PREDICTION
   SCRIPT.JS
   VERSIONE 4.0
========================================================== */

/* ==========================================================
   CONFIGURAZIONE
========================================================== */

const CONFIG = {

    weekendFile: "weekend.json",

    resultsFile: "results.json",

    rankingFile: "ranking.json",

    perfectRaceBonus: 20,

    perfectWeekendBonus: 50

};

/* ==========================================================
   STATO APPLICAZZIONE
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
   PILOTI
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
   PUNTEGGI
========================================================== */

const POINTS = {

    qualifying:{

        exact:[10,8,6,4,2],

        bonus:1

    },

    sprintQualifying:{

        exact:[10,8,6,4,2],

        bonus:1

    },

    sprintRace:{

        exact:[8,7,6,5,4,3,2,1],

        bonus:1

    },

    race:{

        exact:[25,18,15,12,10,8,6,4,2,1],

        bonus:2

    }

};

/* ==========================================================
   CACHE DOM
========================================================== */

const DOM={

    panels:

        document.querySelectorAll(".panel"),

    menuToggle:

        document.getElementById("menuToggle"),

    sideMenu:

        document.getElementById("sideMenu"),

    totalScore:

        document.getElementById("totalScore")

};

/* ==========================================================
   HOME
========================================================== */

const HOME={

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

        document.getElementById("lastPole")

};

/* ==========================================================
   CONTENITORI
========================================================== */

const CONTAINERS={

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

    const el=$(id);

    if(el){

        el.textContent=value;

    }

}

function setHTML(id,value){

    const el=$(id);

    if(el){

        el.innerHTML=value;

    }

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
   CREA OPZIONI PILOTI
========================================================== */

function createDriverOptions(){

    return [

        `<option value="">Seleziona pilota</option>`,

        ...DRIVERS.map(driver =>

            `<option value="${driver}">${driver}</option>`

        )

    ].join("");

}

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

            <span id="${config.resultPrefix}Pos${i}">

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
   COSTRUISCE TUTTE LE TABELLE
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

    if(!container){

        return [];

    }

    return Array.from(

        container.querySelectorAll(".driver-select")

    );

}

/* ==========================================================
   AGGIORNA BLOCCO PILOTI DUPLICATI
========================================================== */

function updateDriverLocks(container){

    const selects = getSessionSelects(container);

    if(selects.length===0){

        return;

    }

    /* --------------------------
       SBLOCCA TUTTO
    -------------------------- */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            option.disabled = false;

        });

    });

    /* --------------------------
       PILOTI GIÀ SCELTI
    -------------------------- */

    const selectedDrivers =

        selects

            .map(select=>select.value)

            .filter(driver=>driver!=="")

    ;

    /* --------------------------
       BLOCCA DUPLICATI
    -------------------------- */

    selects.forEach(select=>{

        Array.from(select.options).forEach(option=>{

            if(option.value===""){

                return;

            }

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
   INIZIALIZZA BLOCCO DUPLICATI
========================================================== */

function initializeDriverLocks(){

    TABLES.forEach(config=>{

        const selects =

            getSessionSelects(

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
   CARICAMENTO JSON
========================================================== */

async function loadJSON(file){

    try{

        const response = await fetch(file,{

            cache:"no-store"

        });

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
   CARICA TUTTI I FILE
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

        name:"",

        circuit:"",

        date:"",

        round:0,

        sprint:false,

        closePrediction:""

    };

    /* --------------------------
       RESULTS
    -------------------------- */

    APP.results = results || {

        qualifying:[],

        sprintQualifying:[],

        sprint:[],

        race:[]

    };

    /* --------------------------
       CLASSIFICA
    -------------------------- */

    APP.ranking = ranking || [];

}

/* ==========================================================
   WEEKEND SPRINT
========================================================== */

function isSprintWeekend(){

    return Boolean(

        APP.weekend?.sprint

    );

}

/* ==========================================================
   MOSTRA / NASCONDE SEZIONI SPRINT
========================================================== */

function updateSprintVisibility(){

    const sprintQualifyingGrid =

        CONTAINERS

            .sprintQualifyingPrediction

            ?.closest(".prediction-grid");

    const sprintRaceGrid =

        CONTAINERS

            .sprintPrediction

            ?.closest(".prediction-grid");

    if(

        sprintQualifyingGrid

    ){

        sprintQualifyingGrid.style.display =

            isSprintWeekend()

                ? "grid"

                : "none";

    }

    if(

        sprintRaceGrid

    ){

        sprintRaceGrid.style.display =

            isSprintWeekend()

                ? "grid"

                : "none";

    }

}
/* ==========================================================
   FUNZIONI DI UTILITÀ
========================================================== */

function $(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = $(id);
    if (element) {
        element.textContent = value;
    }
}

function setHTML(id, value) {
    const element = $(id);
    if (element) {
        element.innerHTML = value;
    }
}

/* ==========================================================
   OPZIONI PILOTI
========================================================== */

function createDriverOptions() {

    let html = `<option value="">Seleziona pilota</option>`;

    DRIVERS.forEach(driver => {

        html += `<option value="${driver}">${driver}</option>`;

    });

    return html;

}
/* ==========================================================
   CREA UNA TABELLA PRONOSTICI
========================================================== */

function createPredictionTable(config){

    if(!config.predictionContainer){

        return;

    }

    const options = createDriverOptions();

    let html = "";

    for(let i = 1; i <= config.positions; i++){

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
   CREA UNA TABELLA RISULTATI
========================================================== */

function createResultTable(config){

    if(!config.resultContainer){

        return;

    }

    let html = "";

    for(let i = 1; i <= config.positions; i++){

        html += `

        <div class="result-row">

            <span id="${config.resultPrefix}Pos${i}">

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
   CREA TUTTE LE TABELLE
========================================================== */

function buildPredictionTables(){

    TABLES.forEach(config=>{

        createPredictionTable(config);

        createResultTable(config);

    });

}
/* ==========================================================
   STATO DEL WEEKEND
========================================================== */

function getWeekendStatus(){

    if(!APP.weekend){

        return "Caricamento...";

    }

    const now = new Date();

    const close = new Date(

        APP.weekend.closePrediction

    );

    if(now < close){

        return "🟢 Pronostici aperti";

    }

    return "🔴 Pronostici chiusi";

}

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
       TIPO WEEKEND
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

    const status =

        getWeekendStatus();

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

    if(APP.ranking.length > 0){

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

    if(APP.results.race.length > 0){

        setText(

            "lastWinner",

            APP.results.race[0]

        );

    }

    if(APP.results.qualifying.length > 0){

        setText(

            "lastPole",

            APP.results.qualifying[0]

        );

    }

    /* --------------------------
       ROUND
    -------------------------- */

    setText(

        "totalGP",

        APP.weekend.round

    );

  
    /* --------------------------
       FERMA IL TIMER PRECEDENTE
    -------------------------- */

    if(APP.countdownTimer){

        clearInterval(

            APP.countdownTimer

        );

    }

    function update(){

        const now = new Date();

        const target = new Date(

            APP.weekend.closePrediction

        );

        const diff = target - now;

        /* --------------------------
           WEEKEND INIZIATO
        -------------------------- */

        if(diff <= 0){

            setText(

                "countdown",

                "Weekend iniziato"

            );

            return;

        }

        /* --------------------------
           GIORNI
        -------------------------- */

        const days = Math.floor(

            diff /

            (1000 * 60 * 60 * 24)

        );

        /* --------------------------
           ORE
        -------------------------- */

        const hours = Math.floor(

            (

                diff %

                (1000 * 60 * 60 * 24)

            ) /

            (1000 * 60 * 60)

        );

        /* --------------------------
           MINUTI
        -------------------------- */

        const minutes = Math.floor(

            (

                diff %

                (1000 * 60 * 60)

            ) /

            (1000 * 60)

        );

        /* --------------------------
           AGGIORNA HOME
        -------------------------- */

        setText(

            "countdown",

            `${days}g ${hours}h ${minutes}m`

        );

    }

    /* --------------------------
       PRIMO AGGIORNAMENTO
    -------------------------- */

    update();

    /* --------------------------
       AGGIORNA OGNI MINUTO
    -------------------------- */

    APP.countdownTimer = setInterval(

        update,

        60000

    );

}
/* ==========================================================
   SCRIVE UNA SINGOLA SESSIONE
========================================================== */

function fillResultSession(config){

    if(!config.results){

        return;

    }

    config.results.forEach((driver,index)=>{

        const input = $(`${config.prefix}${index+1}`);

        const position = $(`${config.prefix}Pos${index+1}`);

        if(input){

            input.value = driver;

        }

        if(position){

            switch(index){

                case 0:

                    position.textContent = "🏆 1°";

                    break;

                case 1:

                    position.textContent = "🥈 2°";

                    break;

                case 2:

                    position.textContent = "🥉 3°";

                    break;

                default:

                    position.textContent = `${index+1}°`;

                    break;

            }

        }

    });

}

/* ==========================================================
   AGGIORNA TUTTE LE SESSIONI
========================================================== */

function updateResultsPage(){

    if(!APP.results){

        return;

    }

    fillResultSession({

        prefix: "qr",

        results: APP.results.qualifying

    });

    fillResultSession({

        prefix: "sqr",

        results: APP.results.sprintQualifying

    });

    fillResultSession({

        prefix: "sr",

        results: APP.results.sprint

    });

    fillResultSession({

        prefix: "rr",

        results: APP.results.race

    });

}
/* ==========================================================
   LETTURA PRONOSTICI
========================================================== */

function getPredictions(prefix, positions){

    const prediction = [];

    for(let i = 1; i <= positions; i++){

        prediction.push(

            $(`${prefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    return prediction;

}

/* ==========================================================
   LETTURA RISULTATI
========================================================== */

function getResults(prefix, positions){

    const result = [];

    for(let i = 1; i <= positions; i++){

        result.push(

            $(`${prefix}${i}`)

                ?.value

                ?.trim()

                .toLowerCase() || ""

        );

    }

    return result;

}

/* ==========================================================
   CALCOLO GENERICO SESSIONE
========================================================== */

function calculateSession(config){

    const predictions = getPredictions(

        config.predictionPrefix,

        config.positions

    );

    const results = getResults(

        config.resultPrefix,

        config.positions

    );

    let total = 0;

    let detail = "";

    predictions.forEach((driver,index)=>{

        if(driver===""){

            detail += `${index+1}° — nessun pronostico<br>`;

            return;

        }

        /* posizione esatta */

        if(driver===results[index]){

            const pts =

                config.points.exact[index] || 0;

            total += pts;

            detail +=

                `🏆 ${index+1}° ${driver} +${pts}<br>`;

            return;

        }

        /* pilota presente */

        if(results.includes(driver)){

            total += config.points.bonus;

            detail +=

                `✔ ${driver} +${config.points.bonus}<br>`;

            return;

        }

        /* errore */

        detail +=

            `✖ ${driver} +0<br>`;

    });

    setText(

        config.scoreId,

        `${total} punti`

    );

    setHTML(

        config.detailId,

        detail

    );

    return total;

}
/* ==========================================================
   CALCOLO QUALIFICHE
========================================================== */

function calculateQualifying(){

    return calculateSession({

        predictionPrefix: "qp",

        resultPrefix: "qr",

        positions: 5,

        points: POINTS.qualifying,

        scoreId: "qualiScore",

        detailId: "qualiDetail"

    });

}

/* ==========================================================
   CALCOLO SPRINT QUALIFYING
========================================================== */

function calculateSprintQualifying(){

    return calculateSession({

        predictionPrefix: "sqp",

        resultPrefix: "sqr",

        positions: 5,

        points: POINTS.sprintQualifying,

        scoreId: "sprintQualiScore",

        detailId: "sprintQualiDetail"

    });

}

/* ==========================================================
   CALCOLO SPRINT RACE
========================================================== */

function calculateSprintRace(){

    return calculateSession({

        predictionPrefix: "sp",

        resultPrefix: "sr",

        positions: 8,

        points: POINTS.sprintRace,

        scoreId: "sprintRaceScore",

        detailId: "sprintRaceDetail"

    });

}

/* ==========================================================
   CALCOLO GARA
========================================================== */

function calculateRace(){

    return calculateSession({

        predictionPrefix: "rp",

        resultPrefix: "rr",

        positions: 10,

        points: POINTS.race,

        scoreId: "raceScore",

        detailId: "raceDetail"

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

    return predictions.every(driver =>
        results.includes(driver)
    );

}

/* ==========================================================
   PERFECT WEEKEND
========================================================== */

function hasPerfectWeekend(){

    const perfectQualifying =

        getPredictions("qp",5)

            .every(driver =>

                getResults("qr",5)

                    .includes(driver)

            );

    const perfectRace = hasPerfectRace();

    if(!APP.weekend.sprint){

        return (

            perfectQualifying &&

            perfectRace

        );

    }

    const perfectSprintQualifying =

        getPredictions("sqp",5)

            .every(driver =>

                getResults("sqr",5)

                    .includes(driver)

            );

    const perfectSprintRace =

        getPredictions("sp",8)

            .every(driver =>

                getResults("sr",8)

                    .includes(driver)

            );

    return (

        perfectQualifying &&

        perfectSprintQualifying &&

        perfectSprintRace &&

        perfectRace

    );

}

/* ==========================================================
   CALCOLO BONUS
========================================================== */

function calculateBonus(){

    let bonus = 0;

    if(hasPerfectRace()){

        bonus += CONFIG.perfectRaceBonus;

    }

    if(hasPerfectWeekend()){

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

    if(APP.weekend.sprint){

        total += calculateSprintQualifying();

        total += calculateSprintRace();

    }

    total += calculateRace();

    const bonus = calculateBonus();

    total += bonus;

    if(DOM.totalScore){

        if(bonus > 0){

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
   MENU HAMBURGER
========================================================== */

function closeMenu(){

    DOM.sideMenu?.classList.remove("open");

    DOM.menuToggle?.classList.remove("active");

}

function openMenu(){

    DOM.sideMenu?.classList.add("open");

    DOM.menuToggle?.classList.add("active");

}

function toggleMenu(){

    if(DOM.sideMenu?.classList.contains("open")){

        closeMenu();

    }else{

        openMenu();

    }

}

function initializeMenu(){

    if(!DOM.menuToggle) return;

    DOM.menuToggle.addEventListener(

        "click",

        toggleMenu

    );

}

function initializeOutsideClick(){

    document.addEventListener("click",event=>{

        if(!DOM.sideMenu || !DOM.menuToggle){

            return;

        }

        const insideMenu=

            DOM.sideMenu.contains(event.target);

        const insideButton=

            DOM.menuToggle.contains(event.target);

        if(!insideMenu && !insideButton){

            closeMenu();

        }

    });

}

/* ==========================================================
   NAVIGAZIONE
========================================================== */

function hidePanels(){

    DOM.panels.forEach(panel=>{

        panel.style.display="none";

    });

}

function showSection(id){

    hidePanels();

    const panel=$(id);

    if(panel){

        panel.style.display="block";

    }

    closeMenu();

}

/* ==========================================================
   COLLEGAMENTO PULSANTI
========================================================== */

function initializeButtons(){

    $("calculateQuali")
        ?.addEventListener("click",calculateQualifying);

    $("calculateSprintQuali")
        ?.addEventListener("click",calculateSprintQualifying);

    $("calculateSprintRace")
        ?.addEventListener("click",calculateSprintRace);

    $("calculateRace")
        ?.addEventListener("click",calculateRace);

    $("calculateTotal")
        ?.addEventListener("click",calculateWeekend);

}

/* ==========================================================
   INIZIALIZZAZIONE APPLICAZIONE
========================================================== */

async function initializeApplication(){

    try{

        console.log("🏁 Avvio Fanta F1 Prediction...");

        await loadAllData();

        buildPredictionTables();

        initializeDriverLocks();

        updateResultsPage();

        updateHome();

        updateSprintVisibility();

        initializeButtons();

        initializeMenu();

        initializeOutsideClick();

        showSection("home");

        console.log("✅ Applicazione pronta");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================================
   AVVIO
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);
