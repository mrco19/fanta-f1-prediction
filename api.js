/* ==========================================================
   FANTA F1 PREDICTION
   api.js
   Versione 2.0
   Compatibile con:

   - admin.html
   - admin.css
   - admin.js
   - index.html
   - styles.css
   - script.js

   Questa versione NON dipende da OpenF1.

   Tutti i dati arrivano dai file JSON creati
   dall'Admin Panel.
========================================================== */


/* ==========================================================
   FILE JSON
========================================================== */

const WEEKEND_FILE = "weekend.json";
const RESULTS_FILE = "results.json";
const RANKING_FILE = "ranking.json";


/* ==========================================================
   DATI GLOBALI
========================================================== */

let weekendData = null;
let resultsData = null;
let rankingData = null;

let countdownTimer = null;


/* ==========================================================
   CARICAMENTO JSON
========================================================== */

async function loadJSON(file) {

    try {

        const response = await fetch(file + "?v=" + Date.now());

        if (!response.ok) {
            throw new Error(file);
        }

        return await response.json();

    }

    catch (error) {

        console.error("Errore caricamento:", file);

        return null;

    }

}


/* ==========================================================
   CARICA TUTTI I FILE
========================================================== */

async function loadSiteData() {

    weekendData = await loadJSON(WEEKEND_FILE);

    resultsData = await loadJSON(RESULTS_FILE);

    rankingData = await loadJSON(RANKING_FILE);

}


/* ==========================================================
   UTILITA'
========================================================== */

function get(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const el = get(id);

    if (!el) return;

    el.textContent = value;

}


function setHTML(id, value) {

    const el = get(id);

    if (!el) return;

    el.innerHTML = value;

}


/* ==========================================================
   FORMATTA DATA
========================================================== */

function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString(

        "it-IT",

        {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );

}


/* ==========================================================
   FORMATTA ORA
========================================================== */

function formatTime(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString(

        "it-IT",

        {

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}


/* ==========================================================
   FORMATTA DATA + ORA
========================================================== */

function formatDateTime(dateString) {

    if (!dateString) return "";

    return `${formatDate(dateString)} • ${formatTime(dateString)}`;

}
/* ==========================================================
   AGGIORNA HOME
========================================================== */

function updateHome() {

    if (!weekendData) {

        console.warn("weekend.json non trovato.");

        return;

    }

    /* ==========================
       DATI GP
    ========================== */

    const gpName =
        weekendData.name || "";

    const circuit =
        weekendData.circuit || "";

    const weekendType =
        weekendData.type || "Weekend Normale";

    const status =
        weekendData.status || "open";

    const startDate =
        weekendData.startDate || "";

    const endDate =
        weekendData.endDate || "";



    /* ==========================
       HERO
    ========================== */

    setText("gpName", gpName);

    setText("weekendType", weekendType);



    /* ==========================
       CARD GP
    ========================== */

    setText("gpCardName", gpName);

    setText("gpCardWeekend", weekendType);

    setText("gpDate", formatDate(startDate));

    setText("gpCircuit", circuit);



    /* ==========================
       STATO WEEKEND
    ========================== */

    const statusElement = get("gpStatus");

    const cardStatus = get("gpCardStatus");

    let statusText = "";
    let statusClass = "";

    switch (status) {

        case "open":

            statusText = "🟢 Pronostici aperti";

            statusClass = "status-open";

            break;

        case "closed":

            statusText = "🔴 Pronostici chiusi";

            statusClass = "status-closed";

            break;

        case "live":

            statusText = "🏁 Weekend in corso";

            statusClass = "status-live";

            break;

        case "finished":

            statusText = "🏆 Weekend concluso";

            statusClass = "status-finished";

            break;

        default:

            statusText = "⚪ Nessuno stato";

            statusClass = "";

    }

    if (statusElement) {

        statusElement.textContent = statusText;

        statusElement.className = "gp-status " + statusClass;

    }

    if (cardStatus) {

        cardStatus.textContent = statusText;

        cardStatus.className = "gp-status " + statusClass;

    }



    /* ==========================
       COUNTDOWN
    ========================== */

    startCountdown(startDate);



    /* ==========================
       ULTIMO GP
    ========================== */

    if (weekendData.lastGP) {

        setText(

            "lastWinner",

            weekendData.lastGP.winner || "-"

        );

        setText(

            "lastPole",

            weekendData.lastGP.pole || "-"

        );

    }



    /* ==========================
       STATISTICHE
    ========================== */

    setText(

        "totalGP",

        weekendData.totalGP || "-"

    );

    setText(

        "leader",

        weekendData.leader || "-"

    );

    setText(

        "leaderPoints",

        weekendData.leaderPoints || "-"

    );

}
/* ==========================================================
   COUNTDOWN
========================================================== */

function startCountdown(dateString) {

    if (!dateString) return;

    if (countdownTimer) {

        clearInterval(countdownTimer);

    }

    updateCountdown(dateString);

    countdownTimer = setInterval(() => {

        updateCountdown(dateString);

    }, 1000);

}


/* ==========================================================
   AGGIORNA COUNTDOWN
========================================================== */

function updateCountdown(dateString) {

    const countdownElement = get("countdown");

    if (!countdownElement) return;

    const targetDate = new Date(dateString);

    const now = new Date();

    const diff = targetDate.getTime() - now.getTime();



    /* ==========================
       GP INIZIATO
    ========================== */

    if (diff <= 0) {

        countdownElement.textContent = "Weekend iniziato";

        return;

    }



    /* ==========================
       CALCOLO TEMPO
    ========================== */

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor((totalSeconds % 86400) / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;



    /* ==========================
       FORMATO
    ========================== */

    let text = "";

    if (days > 0) {

        text += days + "g ";

    }

    text +=
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");



    countdownElement.textContent = text;

}



/* ==========================================================
   STATO WEEKEND AUTOMATICO
========================================================== */

function getWeekendStatus() {

    if (!weekendData) return "closed";

    return weekendData.status || "closed";

}



/* ==========================================================
   PRONOSTICI APERTI?
========================================================== */

function predictionsOpen() {

    return getWeekendStatus() === "open";

}



/* ==========================================================
   WEEKEND SPRINT?
========================================================== */

function isSprintWeekend() {

    if (!weekendData) return false;

    return weekendData.type === "Weekend Sprint";

}
/* ==========================================================
   CARICAMENTO RISULTATI
========================================================== */

function loadResults() {

    if (!resultsData) {

        console.warn("results.json non disponibile.");

        return;

    }

    updateQualifyingResults();

    updateSprintQualifyingResults();

    updateSprintRaceResults();

    updateRaceResults();

}



/* ==========================================================
   QUALIFICHE
========================================================== */

function updateQualifyingResults() {

    if (!resultsData.qualifying) return;

    setResultPositions(

        "qr",

        resultsData.qualifying

    );

}



/* ==========================================================
   SPRINT QUALIFYING
========================================================== */

function updateSprintQualifyingResults() {

    if (!resultsData.sprintQualifying) return;

    setResultPositions(

        "sqr",

        resultsData.sprintQualifying

    );

}



/* ==========================================================
   SPRINT RACE
========================================================== */

function updateSprintRaceResults() {

    if (!resultsData.sprint) return;

    setResultPositions(

        "sr",

        resultsData.sprint

    );

}



/* ==========================================================
   GARA
========================================================== */

function updateRaceResults() {

    if (!resultsData.race) return;

    setResultPositions(

        "rr",

        resultsData.race

    );

}



/* ==========================================================
   INSERIMENTO RISULTATI
========================================================== */

function setResultPositions(prefix, array) {

    if (!Array.isArray(array)) return;

    array.forEach((driver, index) => {

        const field = get(prefix + (index + 1));

        const position = get(prefix + "Pos" + (index + 1));

        if (!field) return;

        field.value = driver || "";



        if (!position) return;



        switch (index + 1) {

            case 1:

                position.textContent = "🏆 1°";

                break;

            case 2:

                position.textContent = "🥈 2°";

                break;

            case 3:

                position.textContent = "🥉 3°";

                break;

            default:

                position.textContent = (index + 1) + "°";

        }

    });

}
/* ==========================================================
   AGGIORNA TUTTO IL SITO
========================================================== */

async function refreshSite() {

    await loadSiteData();

    updateHome();

    loadResults();

}


/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

async function initAPI() {

    console.log("================================");
    console.log("Fanta F1 Prediction");
    console.log("API v2");
    console.log("================================");

    await refreshSite();

}


/* ==========================================================
   REFRESH AUTOMATICO
========================================================== */

function startAutoRefresh() {

    setInterval(async () => {

        await refreshSite();

    }, 60000);

}


/* ==========================================================
   PAGINA PRONTA
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await initAPI();

    startAutoRefresh();

});
