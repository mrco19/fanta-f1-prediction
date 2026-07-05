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
