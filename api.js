/* ==========================================
   API FORMULA 1
========================================== */

const API_BASE = "https://api.jolpi.ca/ergast/f1";

async function getCurrentSeason() {

    const year = new Date().getFullYear();

    return year;

}
async function getNextRace() {

    const season = await getCurrentSeason();

    const response = await fetch(`${API_BASE}/${season}/next.json`);

    const data = await response.json();

    return data;

}
