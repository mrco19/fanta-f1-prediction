/* ==========================================
   API FORMULA 1
   Fanta F1 Prediction
========================================== */

/* ==========================================
   CONFIGURAZIONE
========================================== */

const API_BASE = "https://api.openf1.org/v1";

let currentMeeting = null;

/* ==========================================
   PAUSA TRA LE RICHIESTE
========================================== */

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

/* ==========================================
   PROSSIMO GRAN PREMIO
========================================== */

async function loadWeekendData() {

    try {

        const response = await fetch(`${API_BASE}/meetings?year=2026`);

        const meetings = await response.json();

        if (!Array.isArray(meetings)) {

            console.error(meetings);

            return;

        }

        const now = new Date();

        currentMeeting = meetings.find(meeting =>
            new Date(meeting.date_start) > now
        );

        if (!currentMeeting) {

            console.warn("Nessun GP trovato");

            return;

        }

        updateWeekendUI(currentMeeting);

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   AGGIORNA HOME
========================================== */

function updateWeekendUI(gp) {

    document.getElementById("gpName").textContent =
        `${gp.country_name} ${gp.meeting_name}`;

    document.getElementById("weekendType").textContent =
        gp.meeting_name.includes("Sprint")
        ? "Weekend Sprint"
        : "Weekend Normale";

    document.getElementById("gpCardName").textContent =
        `${gp.country_name} ${gp.meeting_name}`;

    document.getElementById("gpCardWeekend").textContent =
        gp.meeting_name.includes("Sprint")
        ? "Weekend Sprint"
        : "Weekend Normale";

    document.getElementById("gpCardStatus").textContent =
        "🟢 Pronostici aperti";

    document.getElementById("gpDate").textContent =
        new Date(gp.date_start).toLocaleDateString("it-IT", {

            day: "numeric",
            month: "long",
            year: "numeric"

        });

    document.getElementById("gpCircuit").textContent =
        gp.circuit_short_name;

    gpDate = new Date(gp.date_start);

    updateCountdown();

}

/* ==========================================
   CLASSIFICA PILOTI
========================================== */

async function loadDriverStandings() {

    if (!currentMeeting) return;

    console.log("Classifica piloti...");

}

/* ==========================================
   RISULTATI QUALIFICHE
========================================== */

async function loadQualifyingResults() {

    if (!currentMeeting) return;

    try {

        const response = await fetch(

            `${API_BASE}/sessions?meeting_key=${currentMeeting.meeting_key}`

        );

        const sessions = await response.json();

        console.log("Sessioni del weekend:", sessions);

        const qualifying = sessions.find(session =>
            session.session_name === "Qualifying"
        );

        const responseResults = await fetch(

    `${API_BASE}/position?session_key=${qualifying.session_key}`

);

const positions = await responseResults.json();

console.log("Posizioni ricevute:", positions);

    }

    catch(error){

        console.error(error);

    }

}
/* ==========================================
   RISULTATI SPRINT
========================================== */

async function loadSprintResults() {

    if (!currentMeeting) return;

    console.log("Risultati sprint...");

}

/* ==========================================
   RISULTATI GARA
========================================== */

async function loadRaceResults() {

    if (!currentMeeting) return;

    console.log("Risultati gara...");

}

/* ==========================================
   AVVIO API
========================================== */

async function initAPI() {

    await loadWeekendData();

    await sleep(500);

    await loadDriverStandings();

    await sleep(500);

    await loadQualifyingResults();

    await sleep(500);

    await loadSprintResults();

    await sleep(500);

    await loadRaceResults();

}

initAPI();
