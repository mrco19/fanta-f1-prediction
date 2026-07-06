"use strict";

/* ==========================================================
   FANTA F1 PREDICTION
   SCRIPT.JS
   Versione 2.0

   Compatibile con:
   ✔ index.html
   ✔ styles.css
   ✔ admin.html
   ✔ admin.js
   ✔ weekend.json
   ✔ results.json

========================================================== */


/* ==========================================================
   CONFIGURAZIONE GENERALE
========================================================== */

const CONFIG = {

    resultsFile: "results.json",

    weekendFile: "weekend.json",

    rankingFile: "ranking.json"

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

].sort((a, b) => a.localeCompare(b));


/* ==========================================================
   PUNTEGGI UFFICIALI
========================================================== */

const POINTS = {

    qualifying: {
        1: 10,
        2: 8,
        3: 6,
        4: 4,
        5: 2,
        wrong: 1
    },

    sprintQualifying: {
        1: 10,
        2: 8,
        3: 6,
        4: 4,
        5: 2,
        wrong: 1
    },

    sprintRace: {
        1: 8,
        2: 7,
        3: 6,
        4: 5,
        5: 4,
        6: 3,
        7: 2,
        8: 1,
        wrong: 1
    },

    race: {
        1: 25,
        2: 18,
        3: 15,
        4: 12,
        5: 10,
        6: 8,
        7: 6,
        8: 4,
        9: 2,
        10: 1,
        wrong: 2
    }

};


/* ==========================================================
   STATO DEL SITO
========================================================== */

const APP = {

    weekend: null,

    results: null,

    ranking: null,

    countdownTimer: null

};


/* ==========================================================
   RIFERIMENTI DOM
========================================================== */

const DOM = {

    panels:

        document.querySelectorAll(".panel"),

    menuToggle:

        document.getElementById("menuToggle"),

    sideMenu:

        document.getElementById("sideMenu"),


    /* HOME */

    gpName:

        document.getElementById("gpName"),

    weekendType:

        document.getElementById("weekendType"),

    gpStatus:

        document.getElementById("gpStatus"),

    gpCardName:

        document.getElementById("gpCardName"),

    gpCardWeekend:

        document.getElementById("gpCardWeekend"),

    gpCardStatus:

        document.getElementById("gpCardStatus"),

    gpDate:

        document.getElementById("gpDate"),

    gpCircuit:

        document.getElementById("gpCircuit"),

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
   CONTENITORI PRONOSTICI
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
   FUNZIONI DI UTILITÀ
========================================================== */

function $(id) {

    return document.getElementById(id);

}

function createDriverOptions() {

    return [

        `<option value="">Seleziona pilota</option>`,

        ...DRIVERS.map(driver =>

            `<option value="${driver}">${driver}</option>`

        )

    ].join("");

}
/* ==========================================================
   GENERAZIONE CAMPI PRONOSTICI
========================================================== */

function createPredictionRows(container, prefix, positions) {

    if (!container) return;

    const options = createDriverOptions();

    let html = "";

    for (let i = 1; i <= positions; i++) {

        html += `
            <div class="input-row">

                <span>${i}°</span>

                <select
                    id="${prefix}${i}"
                    class="driver-select">

                    ${options}

                </select>

            </div>
        `;

    }

    container.innerHTML = html;

}


/* ==========================================================
   GENERAZIONE CAMPI RISULTATI
========================================================== */

function createResultRows(container, prefix, positions) {

    if (!container) return;

    let html = "";

    for (let i = 1; i <= positions; i++) {

        html += `
            <div class="result-row">

                <span id="${prefix}Pos${i}">
                    ${i}°
                </span>

                <input
                    id="${prefix}${i}"
                    class="result-field"
                    readonly>

            </div>
        `;

    }

    container.innerHTML = html;

}


/* ==========================================================
   COSTRUZIONE PAGINA PRONOSTICI
========================================================== */

function buildPredictionPage() {

    createPredictionRows(

        CONTAINERS.qualifyingPrediction,

        "qp",

        5

    );

    createResultRows(

        CONTAINERS.qualifyingResult,

        "qr",

        5

    );



    createPredictionRows(

        CONTAINERS.sprintQualifyingPrediction,

        "sqp",

        5

    );

    createResultRows(

        CONTAINERS.sprintQualifyingResult,

        "sqr",

        5

    );



    createPredictionRows(

        CONTAINERS.sprintPrediction,

        "sp",

        8

    );

    createResultRows(

        CONTAINERS.sprintResult,

        "sr",

        8

    );



    createPredictionRows(

        CONTAINERS.racePrediction,

        "rp",

        10

    );

    createResultRows(

        CONTAINERS.raceResult,

        "rr",

        10

    );

}


/* ==========================================================
   BLOCCO PILOTI DUPLICATI
========================================================== */

function updateDriverLocks(container) {

    const selects =

        Array.from(

            container.querySelectorAll(".driver-select")

        );

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            option.disabled = false;

        });

    });

    const selected =

        selects

        .map(s => s.value)

        .filter(Boolean);

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            if (option.value === "") return;

            if (

                selected.includes(option.value) &&

                option.value !== select.value

            ) {

                option.disabled = true;

            }

        });

    });

}


/* ==========================================================
   ATTIVA BLOCCO DUPLICATI
========================================================== */

function enableDriverLocks() {

    document

        .querySelectorAll(

            "#quali-predictions," +
            "#sprintquali-predictions," +
            "#sprint-predictions," +
            "#race-predictions"

        )

        .forEach(container => {

            const selects =

                container.querySelectorAll(

                    ".driver-select"

                );

            selects.forEach(select => {

                select.addEventListener(

                    "change",

                    () => updateDriverLocks(container)

                );

            });

            updateDriverLocks(container);

        });

}


/* ==========================================================
   NAVIGAZIONE
========================================================== */

function showSection(id) {

    DOM.panels.forEach(panel => {

        panel.style.display = "none";

    });

    const target = $(id);

    if (target) {

        target.style.display = "block";

    }

    if (DOM.sideMenu) {

        DOM.sideMenu.classList.remove("open");

    }

    if (DOM.menuToggle) {

        DOM.menuToggle.classList.remove("active");

    }

}


/* ==========================================================
   MENU HAMBURGER
========================================================== */

function initializeMenu() {

    if (

        !DOM.menuToggle ||

        !DOM.sideMenu

    ) return;

    DOM.menuToggle.addEventListener(

        "click",

        () => {

            DOM.menuToggle.classList.toggle(

                "active"

            );

            DOM.sideMenu.classList.toggle(

                "open"

            );

        }

    );

}
/* ==========================================================
   FETCH JSON
========================================================== */

async function loadJSON(file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(
                `Errore caricamento ${file}`
            );

        }

        return await response.json();

    }

    catch (error) {

        console.error(error);

        return null;

    }

}


/* ==========================================================
   CARICAMENTO DATI
========================================================== */

async function loadWeekend() {

    APP.weekend =
        await loadJSON(CONFIG.weekendFile);

}


async function loadResults() {

    APP.results =
        await loadJSON(CONFIG.resultsFile);

}


async function loadRanking() {

    APP.ranking =
        await loadJSON(CONFIG.rankingFile);

}


/* ==========================================================
   VERIFICA WEEKEND SPRINT
========================================================== */

function isSprintWeekend() {

    if (!APP.weekend) return false;

    return APP.weekend.type
        .toLowerCase()
        .includes("sprint");

}


/* ==========================================================
   MOSTRA / NASCONDI SEZIONI SPRINT
========================================================== */

function updateSprintVisibility() {

    const sprintQualifyingSection =

        CONTAINERS
            .sprintQualifyingPrediction
            ?.closest("section")
            ?.parentElement;

    const sprintRaceSection =

        CONTAINERS
            .sprintPrediction
            ?.closest("section")
            ?.parentElement;

    if (!sprintQualifyingSection) return;

    if (!sprintRaceSection) return;

    if (isSprintWeekend()) {

        sprintQualifyingSection.style.display =
            "grid";

        sprintRaceSection.style.display =
            "grid";

    }

    else {

        sprintQualifyingSection.style.display =
            "none";

        sprintRaceSection.style.display =
            "none";

    }

}


/* ==========================================================
   SCRIVE I RISULTATI
========================================================== */

function writeResults(prefix, list) {

    if (!list) return;

    list.forEach((driver, index) => {

        const input =

            $(`${prefix}${index + 1}`);

        if (!input) return;

        input.value = driver;

        const position =

            $(`${prefix}Pos${index + 1}`);

        if (!position) return;

        switch (index) {

            case 0:

                position.textContent =
                    "🏆 1°";

                break;

            case 1:

                position.textContent =
                    "🥈 2°";

                break;

            case 2:

                position.textContent =
                    "🥉 3°";

                break;

            default:

                position.textContent =
                    `${index + 1}°`;

        }

    });

}


/* ==========================================================
   CARICA RISULTATI NELLA PAGINA
========================================================== */

function updateResultsPage() {

    if (!APP.results) return;

    writeResults(

        "qr",

        APP.results.qualifying

    );

    writeResults(

        "sqr",

        APP.results.sprintQualifying

    );

    writeResults(

        "sr",

        APP.results.sprint

    );

    writeResults(

        "rr",

        APP.results.race

    );

}
/* ==========================================================
   LETTURA PRONOSTICI
========================================================== */

function getPredictions(prefix, positions) {

    const prediction = [];

    for (let i = 1; i <= positions; i++) {

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

function getResults(prefix, positions) {

    const result = [];

    for (let i = 1; i <= positions; i++) {

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
   CALCOLO GENERICO
========================================================== */

function calculateSession({

    predictionPrefix,

    resultPrefix,

    positions,

    table,

    wrongPoints,

    scoreId,

    detailId

}) {

    const prediction =

        getPredictions(

            predictionPrefix,

            positions

        );

    const result =

        getResults(

            resultPrefix,

            positions

        );

    let total = 0;

    let html = "";


    prediction.forEach((driver, index) => {

        const position = index + 1;

        if (!driver) {

            html +=
                `${position}° — nessun pronostico<br>`;

            return;

        }

        /* posizione esatta */

        if (driver === result[index]) {

            const pts =

                table[position] || 0;

            total += pts;

            html +=

                `🏆 ${position}° ${driver}
                 +${pts}<br>`;

            return;

        }

        /* pilota presente */

        if (result.includes(driver)) {

            total += wrongPoints;

            html +=

                `✔ ${position}° ${driver}
                 +${wrongPoints}<br>`;

            return;

        }

        /* errore */

        html +=

            `✖ ${position}° ${driver}
             +0<br>`;

    });

    $(scoreId).textContent =

        `${total} punti`;

    $(detailId).innerHTML =

        html;

    return total;

}


/* ==========================================================
   QUALIFICHE
========================================================== */

function calculateQualifying() {

    return calculateSession({

        predictionPrefix: "qp",

        resultPrefix: "qr",

        positions: 5,

        table: POINTS.qualifying,

        wrongPoints: POINTS.qualifying.wrong,

        scoreId: "qualiScore",

        detailId: "qualiDetail"

    });

}


/* ==========================================================
   SPRINT QUALIFYING
========================================================== */

function calculateSprintQualifying() {

    return calculateSession({

        predictionPrefix: "sqp",

        resultPrefix: "sqr",

        positions: 5,

        table: POINTS.sprintQualifying,

        wrongPoints:

            POINTS.sprintQualifying.wrong,

        scoreId: "sprintQualiScore",

        detailId: "sprintQualiDetail"

    });

}


/* ==========================================================
   SPRINT RACE
========================================================== */

function calculateSprintRace() {

    return calculateSession({

        predictionPrefix: "sp",

        resultPrefix: "sr",

        positions: 8,

        table: POINTS.sprintRace,

        wrongPoints:

            POINTS.sprintRace.wrong,

        scoreId: "sprintRaceScore",

        detailId: "sprintRaceDetail"

    });

}


/* ==========================================================
   GARA
========================================================== */

function calculateRace() {

    return calculateSession({

        predictionPrefix: "rp",

        resultPrefix: "rr",

        positions: 10,

        table: POINTS.race,

        wrongPoints:

            POINTS.race.wrong,

        scoreId: "raceScore",

        detailId: "raceDetail"

    });

}
/* ==========================================================
   PERFECT RACE BONUS
========================================================== */

function hasPerfectRace() {

    const prediction =
        getPredictions("rp", 10);

    const result =
        getResults("rr", 10);

    if (
        prediction.includes("") ||
        result.includes("")
    ) {
        return false;
    }

    return prediction.every(driver =>
        result.includes(driver)
    );

}


/* ==========================================================
   PERFECT WEEKEND BONUS
========================================================== */

function hasPerfectWeekend() {

    const perfectQualifying =

        getPredictions("qp", 5)
            .every(driver =>
                getResults("qr", 5)
                    .includes(driver)
            );

    const perfectRace =
        hasPerfectRace();

    if (!isSprintWeekend()) {

        return (
            perfectQualifying &&
            perfectRace
        );

    }

    const perfectSprintQualifying =

        getPredictions("sqp", 5)
            .every(driver =>
                getResults("sqr", 5)
                    .includes(driver)
            );

    const perfectSprintRace =

        getPredictions("sp", 8)
            .every(driver =>
                getResults("sr", 8)
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

function calculateBonus() {

    let totalBonus = 0;

    if (hasPerfectRace()) {

        totalBonus +=
            CONFIG.perfectRaceBonus;

    }

    if (hasPerfectWeekend()) {

        totalBonus +=
            CONFIG.perfectWeekendBonus;

    }

    return totalBonus;

}


/* ==========================================================
   CALCOLO TOTALE WEEKEND
========================================================== */

function calculateWeekend() {

    let total = 0;

    total += calculateQualifying();

    if (isSprintWeekend()) {

        total +=
            calculateSprintQualifying();

        total +=
            calculateSprintRace();

    }

    total += calculateRace();

    const bonus =
        calculateBonus();

    total += bonus;

    const totalLabel =
        $("totalScore");

    if (bonus > 0) {

        totalLabel.innerHTML =

            `
            Totale Weekend

            <br><br>

            ${total} punti

            <br>

            ⭐ Bonus: +${bonus}
            `;

    }

    else {

        totalLabel.innerHTML =

            `
            Totale Weekend

            <br><br>

            ${total} punti
            `;

    }

    return total;

}


/* ==========================================================
   EVENTI PULSANTI
========================================================== */

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
/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

async function initializeApp() {

    console.log("🏁 Avvio Fanta F1 Prediction");


    /* --------------------------
       CARICA FILE JSON
    -------------------------- */

    await loadWeekend();

    await loadResults();

    await loadRanking();


    /* --------------------------
       CREA SELECT
    -------------------------- */

    createQualifying();

    createSprintQualifying();

    createSprintRace();

    createRace();


    /* --------------------------
       DUPLICATI
    -------------------------- */

    initializeDriverLocks();


    /* --------------------------
       CARICA RISULTATI
    -------------------------- */

    updateResultsPage();


    /* --------------------------
       HOME
    -------------------------- */

    updateHome();


    /* --------------------------
       SPRINT
    -------------------------- */

    updateSprintVisibility();


    console.log("✅ Applicazione pronta");

}


/* ==========================================================
   AVVIO
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);
/* ==========================================================
   TEMPLATE SELECT PILOTI
========================================================== */

function createDriverOptions() {

    let html = '<option value="">Seleziona pilota</option>';

    DRIVERS.forEach(driver => {

        html += `
            <option value="${driver}">
                ${driver}
            </option>
        `;

    });

    return html;

}


/* ==========================================================
   TEMPLATE RIGA PRONOSTICO
========================================================== */

function createPredictionRow(position, prefix) {

    return `

        <div class="input-row">

            <span>${position}°</span>

            <select
                id="${prefix}${position}"
                class="driver-select">

                ${createDriverOptions()}

            </select>

        </div>

    `;

}


/* ==========================================================
   TEMPLATE RIGA RISULTATO
========================================================== */

function createResultRow(position, prefix) {

    return `

        <div class="result-row">

            <span id="${prefix}Pos${position}">
                ${position}°
            </span>

            <input
                id="${prefix}${position}"
                class="result-field"
                readonly>

        </div>

    `;

}


/* ==========================================================
   CREA UNA SESSIONE COMPLETA
========================================================== */

function createSession({

    predictionContainer,
    resultContainer,

    predictionPrefix,
    resultPrefix,

    positions

}) {

    const prediction =
        $(predictionContainer);

    const result =
        $(resultContainer);

    prediction.innerHTML = "";

    result.innerHTML = "";

    for (let i = 1; i <= positions; i++) {

        prediction.innerHTML +=

            createPredictionRow(

                i,

                predictionPrefix

            );

        result.innerHTML +=

            createResultRow(

                i,

                resultPrefix

            );

    }

}


/* ==========================================================
   QUALIFICHE
========================================================== */

function createQualifying() {

    createSession({

        predictionContainer:
            "quali-predictions",

        resultContainer:
            "quali-results",

        predictionPrefix:
            "qp",

        resultPrefix:
            "qr",

        positions: 5

    });

}


/* ==========================================================
   SPRINT QUALIFYING
========================================================== */

function createSprintQualifying() {

    createSession({

        predictionContainer:
            "sprintquali-predictions",

        resultContainer:
            "sprintquali-results",

        predictionPrefix:
            "sqp",

        resultPrefix:
            "sqr",

        positions: 5

    });

}


/* ==========================================================
   SPRINT RACE
========================================================== */

function createSprintRace() {

    createSession({

        predictionContainer:
            "sprint-predictions",

        resultContainer:
            "sprint-results",

        predictionPrefix:
            "sp",

        resultPrefix:
            "sr",

        positions: 8

    });

}


/* ==========================================================
   GARA
========================================================== */

function createRace() {

    createSession({

        predictionContainer:
            "race-predictions",

        resultContainer:
            "race-results",

        predictionPrefix:
            "rp",

        resultPrefix:
            "rr",

        positions: 10

    });

}
/* ==========================================================
   GESTIONE PILOTI DUPLICATI
========================================================== */

function getSessionSelects(containerId) {

    const container = $(containerId);

    if (!container) {
        return [];
    }

    return Array.from(

        container.querySelectorAll(

            ".driver-select"

        )

    );

}


/* ==========================================================
   AGGIORNA BLOCCHI DUPLICATI
========================================================== */

function updateDriverLocks(containerId) {

    const selects =

        getSessionSelects(containerId);

    if (selects.length === 0) {
        return;
    }


    /* --------------------------
       SBLOCCA TUTTO
    -------------------------- */

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            option.disabled = false;

        });

    });


    /* --------------------------
       PILOTI GIÀ SCELTI
    -------------------------- */

    const selectedDrivers =

        selects

            .map(select => select.value)

            .filter(value => value !== "");


    /* --------------------------
       BLOCCA DUPLICATI
    -------------------------- */

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            if (option.value === "") {
                return;
            }

            if (

                selectedDrivers.includes(option.value)

                &&

                option.value !== select.value

            ) {

                option.disabled = true;

            }

        });

    });

}


/* ==========================================================
   INIZIALIZZA BLOCCO DUPLICATI
========================================================== */

function initializeDriverLocks() {

    const sessions = [

        "quali-predictions",

        "sprintquali-predictions",

        "sprint-predictions",

        "race-predictions"

    ];

    sessions.forEach(containerId => {

        const selects =

            getSessionSelects(containerId);

        selects.forEach(select => {

            select.addEventListener(

                "change",

                () => {

                    updateDriverLocks(

                        containerId

                    );

                }

            );

        });

        updateDriverLocks(containerId);

    });

}
fillResultSession({

    prefix: "xyz",

    results: RESULTS.special

});
/* ==========================================================
   HOME
========================================================== */

function updateHome() {

    if (!WEEKEND) return;


    /* --------------------------
       GP
    -------------------------- */

    setText(

        "gpName",

        WEEKEND.name

    );

    setText(

        "gpCardName",

        WEEKEND.name

    );


    /* --------------------------
       CIRCUITO
    -------------------------- */

    setText(

        "gpCircuit",

        WEEKEND.circuit

    );


    /* --------------------------
       DATA
    -------------------------- */

    setText(

        "gpDate",

        WEEKEND.date

    );


    /* --------------------------
       WEEKEND
    -------------------------- */

    const weekendType =

        WEEKEND.sprint

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

    if (

        RANKING.length > 0

    ) {

        setText(

            "leader",

            RANKING[0].name

        );

        setText(

            "leaderPoints",

            RANKING[0].points

        );

    }


    /* --------------------------
       ULTIMO GP
    -------------------------- */

    if (

        RESULTS.race.length > 0

    ) {

        setText(

            "lastWinner",

            RESULTS.race[0]

        );

    }

    if (

        RESULTS.qualifying.length > 0

    ) {

        setText(

            "lastPole",

            RESULTS.qualifying[0]

        );

    }


    /* --------------------------
       NUMERO GP
    -------------------------- */

    setText(

        "totalGP",

        WEEKEND.round

    );


    /* --------------------------
       COUNTDOWN
    -------------------------- */

    startCountdown();

}


/* ==========================================================
   STATO WEEKEND
========================================================== */

function getWeekendStatus() {

    if (!WEEKEND) {

        return "Caricamento...";

    }

    const now = new Date();

    const close =

        new Date(

            WEEKEND.closePrediction

        );

    if (now < close) {

        return "🟢 Pronostici aperti";

    }

    return "🔴 Pronostici chiusi";

}


/* ==========================================================
   COUNTDOWN
========================================================== */

let countdownTimer = null;

function startCountdown() {

    if (!WEEKEND) return;

    if (countdownTimer) {

        clearInterval(

            countdownTimer

        );

    }

    function update() {

        const now = new Date();

        const target =

            new Date(

                WEEKEND.closePrediction

            );

        const diff = target - now;

        if (diff <= 0) {

            setText(

                "countdown",

                "Weekend iniziato"

            );

            return;

        }

        const days =

            Math.floor(

                diff /

                1000 /

                60 /

                60 /

                24

            );

        const hours =

            Math.floor(

                (

                    diff %

                    (

                        1000 *

                        60 *

                        60 *

                        24

                    )

                )

                /

                (

                    1000 *

                    60 *

                    60

                )

            );

        const minutes =

            Math.floor(

                (

                    diff %

                    (

                        1000 *

                        60 *

                        60

                    )

                )

                /

                (

                    1000 *

                    60

                )

            );

        setText(

            "countdown",

            `${days}g ${hours}h ${minutes}m`

        );

    }

    update();

    countdownTimer =

        setInterval(

            update,

            60000

        );

}
/* ==========================================================
   NAVIGAZIONE PANNELLI
========================================================== */

function hidePanels() {

    document

        .querySelectorAll(".panel")

        .forEach(panel => {

            panel.style.display = "none";

        });

}


function showPanel(id) {

    hidePanels();

    const panel = $(id);

    if (!panel) {
        return;
    }

    panel.style.display = "block";

}


/* ==========================================================
   MENU
========================================================== */

function closeMenu() {

    const menu = $("sideMenu");

    const button = $("menuToggle");

    if (menu) {

        menu.classList.remove("open");

    }

    if (button) {

        button.classList.remove("active");

    }

}


function openMenu() {

    const menu = $("sideMenu");

    const button = $("menuToggle");

    if (menu) {

        menu.classList.add("open");

    }

    if (button) {

        button.classList.add("active");

    }

}


function toggleMenu() {

    const menu = $("sideMenu");

    if (!menu) {
        return;
    }

    if (

        menu.classList.contains("open")

    ) {

        closeMenu();

    } else {

        openMenu();

    }

}


/* ==========================================================
   MENU HAMBURGER
========================================================== */

function initializeMenu() {

    const button = $("menuToggle");

    if (!button) {
        return;
    }

    button.addEventListener(

        "click",

        toggleMenu

    );

}


/* ==========================================================
   CAMBIO PAGINA
========================================================== */

function showSection(id) {

    showPanel(id);

    closeMenu();

}


/* ==========================================================
   CLICK FUORI MENU
========================================================== */

function initializeOutsideClick() {

    document.addEventListener(

        "click",

        event => {

            const menu = $("sideMenu");

            const button = $("menuToggle");

            if (

                !menu ||

                !button

            ) {

                return;

            }

            const insideMenu =

                menu.contains(event.target);

            const insideButton =

                button.contains(event.target);

            if (

                !insideMenu &&

                !insideButton

            ) {

                closeMenu();

            }

        }

    );

}
/* ==========================================================
   INIZIALIZZAZIONE APPLICAZIONE
========================================================== */

async function initializeApplication() {

    try {

        /* --------------------------
           CARICAMENTO DATI
        -------------------------- */

        await loadAllData();


        /* --------------------------
           CREAZIONE SESSIONI
        -------------------------- */

        createQualifying();

        createSprintQualifying();

        createSprintRace();

        createRace();


        /* --------------------------
           RISULTATI
        -------------------------- */

        updateResultsPage();


        /* --------------------------
           BLOCCHI DUPLICATI
        -------------------------- */

        initializeDriverLocks();


        /* --------------------------
           HOME
        -------------------------- */

        updateHome();


        /* --------------------------
           MENU
        -------------------------- */

        initializeMenu();

        initializeOutsideClick();


        /* --------------------------
           PAGINA INIZIALE
        -------------------------- */

        showSection("home");


        console.log(

            "✅ Fanta F1 Prediction avviato"

        );

    }

    catch (error) {

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
