/* ==========================================
   API FORMULA 1
========================================== */

async function loadWeekendData() {

    try {

        const response = await fetch(
            "https://api.openf1.org/v1/meetings?year=2026"
        );

        const meetings = await response.json();

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
loadWeekendData();
loadDriverStandings();

