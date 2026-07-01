/* ==========================================
   API FORMULA 1
========================================== */

async function loadWeekendData() {

    try {

        const response = await fetch(
            "https://api.openf1.org/v1/meetings?year=2026"
        );

        const meetings = await response.json();

     if (!Array.isArray(meetings)) {

    console.error("OpenF1 ha restituito:", meetings);

    return;

}

        const now = new Date();

        // Cerca il primo GP futuro
        const nextGP = meetings.find(gp =>
            new Date(gp.date_start) > now
        );

        console.log("Prossimo GP:", nextGP);
       
       document.getElementById("gpName").textContent =
    `${nextGP.country_name} ${nextGP.meeting_name}`;

document.getElementById("weekendType").textContent =
    nextGP.meeting_name.includes("Sprint")
        ? "Weekend Sprint"
        : "Weekend Normale";

       document.getElementById("gpCardName").textContent =
    `${nextGP.country_name} ${nextGP.meeting_name}`;

document.getElementById("gpCardWeekend").textContent =
    nextGP.meeting_name.includes("Sprint")
        ? "Weekend Sprint"
        : "Weekend Normale";

document.getElementById("gpCardStatus").textContent =
    "🟢 Pronostici aperti";
       
       gpDate = new Date(nextGP.date_start);

updateCountdown();

// Data del weekend
document.getElementById("gpDate").textContent =
    new Date(nextGP.date_start).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Circuito
document.getElementById("gpCircuit").textContent =
    nextGP.circuit_short_name;
       
    } catch(error) {

        console.error(error);

    }
   

}
async function loadDriverStandings() {

    try {

        const response = await fetch(
            "https://api.openf1.org/v1/drivers?session_key=latest"
        );

        const drivers = await response.json();

        console.log(drivers);

    } catch (error) {

        console.error(error);

    }

}

async function loadQualifyingResults() {

    try {

        const response = await fetch(
            "https://api.openf1.org/v1/sessions?year=2026"
        );

        const sessions = await response.json();

        console.log("Sessioni:", sessions);
       
       const qualifying = sessions.find(session =>
    session.meeting_key === 1289 &&
    session.session_name === "Qualifying"
     );

console.log("Qualifiche:", qualifying);

       const responseResults = await fetch(
    `https://api.openf1.org/v1/position?session_key=${qualifying.session_key}`
);

const positions = await responseResults.json();

console.log("Posizioni:", positions);

    } catch(error) {

        console.error(error);

    }

}

loadWeekendData();
loadDriverStandings();
loadQualifyingResults();
