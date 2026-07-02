/* ==========================================
   FANTA F1 ADMIN
   Versione 2.0
========================================== */

"use strict";

/* ==========================================
   PILOTI F1 2026
========================================== */

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

/* ==========================================
   CONFIGURAZIONE
========================================== */

const API_BASE = "https://api.openf1.org/v1";

let currentMeeting = null;
let gpDate = null;

/* ==========================================
   LISTA PILOTI
========================================== */

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

/* ==========================================
   CACHE DOM
========================================== */

const DOM = {

    qualiPredictions:
        document.getElementById("quali-predictions"),

    qualiResults:
        document.getElementById("quali-results"),

    sprintQualiPredictions:
        document.getElementById("sprintquali-predictions"),

    sprintQualiResults:
        document.getElementById("sprintquali-results"),

    sprintPredictions:
        document.getElementById("sprint-predictions"),

    sprintResults:
        document.getElementById("sprint-results"),

    racePredictions:
        document.getElementById("race-predictions"),

    raceResults:
        document.getElementById("race-results"),

    totalScore:
        document.getElementById("totalScore")

};

/* ==========================================
   PUNTEGGI
========================================== */

const POINTS = {

    qualifying: {

        exact: {
            1: 10,
            2: 8,
            3: 6,
            4: 4,
            5: 2
        },

        bonus: 1

    },

    sprintQualifying: {

        exact: {
            1: 10,
            2: 8,
            3: 6,
            4: 4,
            5: 2
        },

        bonus: 1

    },

    sprintRace: {

        exact: {
            1: 8,
            2: 7,
            3: 6,
            4: 5,
            5: 4,
            6: 3,
            7: 2,
            8: 1
        },

        bonus: 1

    },

    race: {

        exact: {
            1: 25,
            2: 18,
            3: 15,
            4: 12,
            5: 10,
            6: 8,
            7: 6,
            8: 4,
            9: 2,
            10: 1
        },

        bonus: 2

    }

};

/* ==========================================
   CONFIGURAZIONE TABELLE
========================================== */

const TABLES = [

    {

        predictionContainer: "quali-predictions",
        resultContainer: "quali-results",

        predictionPrefix: "qp",
        resultPrefix: "qr",

        positions: 5,

        score: "qualiScore",
        detail: "qualiDetail",

        points: POINTS.qualifying

    },

    {

        predictionContainer: "sprintquali-predictions",
        resultContainer: "sprintquali-results",

        predictionPrefix: "sqp",
        resultPrefix: "sqr",

        positions: 5,

        score: "sprintQualiScore",
        detail: "sprintQualiDetail",

        points: POINTS.sprintQualifying

    },

    {

        predictionContainer: "sprint-predictions",
        resultContainer: "sprint-results",

        predictionPrefix: "sp",
        resultPrefix: "sr",

        positions: 8,

        score: "sprintRaceScore",
        detail: "sprintRaceDetail",

        points: POINTS.sprintRace

    },

    {

        predictionContainer: "race-predictions",
        resultContainer: "race-results",

        predictionPrefix: "rp",
        resultPrefix: "rr",

        positions: 10,

        score: "raceScore",
        detail: "raceDetail",

        points: POINTS.race

    }

];
/* ==========================================
   CREAZIONE TABELLE
========================================== */

function createPredictionTable(config) {

    const container = document.getElementById(
        config.predictionContainer
    );

    if (!container) return;

    let html = "";

    const options =

        `<option value="">Seleziona pilota</option>` +

        DRIVERS.map(driver =>

            `<option value="${driver}">${driver}</option>`

        ).join("");

    for (let i = 1; i <= config.positions; i++) {

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

    container.innerHTML = html;

}

/* ==========================================
   CREAZIONE RISULTATI
========================================== */

function createResultsTable(config) {

    const container = document.getElementById(
        config.resultContainer
    );

    if (!container) return;

    let html = "";

    for (let i = 1; i <= config.positions; i++) {

        html += `

            <div class="result-row">

                <span
                    id="${config.resultPrefix}Pos${i}">

                    ${i}°

                </span>

                <input

                    id="${config.resultPrefix}${i}"

                    class="result-field"

                    readonly

                >

            </div>

        `;

    }

    container.innerHTML = html;

}

/* ==========================================
   GENERAZIONE COMPLETA
========================================== */

function buildTables() {

    TABLES.forEach(config => {

        createPredictionTable(config);

        createResultsTable(config);

    });

}
/* ==========================================
   GESTIONE SELECT PILOTI
========================================== */

function getSelects(containerId) {

    const container = document.getElementById(containerId);

    if (!container) return [];

    return Array.from(

        container.querySelectorAll(".driver-select")

    );

}

/* ==========================================
   BLOCCO DUPLICATI
========================================== */

function updateDuplicateProtection(containerId) {

    const selects = getSelects(containerId);

    /* Riabilita tutte le opzioni */

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            option.disabled = false;

        });

    });

    /* Piloti selezionati */

    const selectedDrivers = selects

        .map(select => select.value)

        .filter(driver => driver !== "");

    /* Blocca i duplicati */

    selects.forEach(select => {

        Array.from(select.options).forEach(option => {

            if (option.value === "") return;

            if (

                selectedDrivers.includes(option.value) &&

                option.value !== select.value

            ) {

                option.disabled = true;

            }

        });

    });

}

/* ==========================================
   INIZIALIZZA PROTEZIONE
========================================== */

function initializeDuplicateProtection() {

    TABLES.forEach(config => {

        const selects = getSelects(

            config.predictionContainer

        );

        selects.forEach(select => {

            select.addEventListener(

                "change",

                () => {

                    updateDuplicateProtection(

                        config.predictionContainer

                    );

                }

            );

        });

        updateDuplicateProtection(

            config.predictionContainer

        );

    });

}
/* ==========================================
   CARICAMENTO RESULTS.JSON
========================================== */

async function loadResults() {

    try {

        const response = await fetch("results.json");

        if (!response.ok) {

            throw new Error("results.json non trovato");

        }

        const data = await response.json();

        applyResults(data);

        console.log("✅ Risultati caricati");

    }

    catch(error){

        console.error("Errore caricamento risultati:", error);

    }

}

/* ==========================================
   APPLICA RISULTATI
========================================== */

function applyResults(data) {

    const mapping = [

        {
            json: data.qualifying,
            prefix: "qr"
        },

        {
            json: data.sprintQualifying,
            prefix: "sqr"
        },

        {
            json: data.sprint,
            prefix: "sr"
        },

        {
            json: data.race,
            prefix: "rr"
        }

    ];

    mapping.forEach(section => {

        if (!section.json) return;

        section.json.forEach((driver,index)=>{

            const input = document.getElementById(

                `${section.prefix}${index+1}`

            );

            const pos = document.getElementById(

                `${section.prefix}Pos${index+1}`

            );

            if(input){

                input.value = driver;

                input.classList.add("loaded");

            }

            if(pos){

                if(index===0){

                    pos.textContent="🏆 1°";

                }

                else if(index===1){

                    pos.textContent="🥈 2°";

                }

                else if(index===2){

                    pos.textContent="🥉 3°";

                }

                else{

                    pos.textContent=`${index+1}°`;

                }

            }

        });

    });

}
/* ==========================================
   CALCOLO PUNTEGGI
========================================== */

function calculateScore(config){

    let total = 0;

    let detail = "";

    const prediction = [];
    const result = [];

    for(let i=1;i<=config.positions;i++){

        prediction.push(

            document
            .getElementById(`${config.predictionPrefix}${i}`)
            ?.value
            ?.trim()
            .toLowerCase() || ""

        );

        result.push(

            document
            .getElementById(`${config.resultPrefix}${i}`)
            ?.value
            ?.trim()
            .toLowerCase() || ""

        );

    }

    prediction.forEach((driver,index)=>{

        if(driver==="") return;

        /* posizione esatta */

        if(driver===result[index]){

            const pts =
                config.points.exact[index+1] || 0;

            total += pts;

            detail +=
                `🏁 ${index+1}° ${driver} +${pts}<br>`;

            return;

        }

        /* pilota presente */

        if(result.includes(driver)){

            total += config.points.bonus;

            detail +=
                `✔ ${driver} +${config.points.bonus}<br>`;

            return;

        }

        detail +=
            `✖ ${driver} +0<br>`;

    });

    document.getElementById(config.score).textContent =
        `${total} punti`;

    document.getElementById(config.detail).innerHTML =
        detail;

    return total;

}

/* ==========================================
   CALCOLA TUTTO
========================================== */

function calculateAllScores(){

    let weekendTotal = 0;

    TABLES.forEach(config=>{

        weekendTotal += calculateScore(config);

    });

    if(DOM.totalScore){

        DOM.totalScore.textContent =
            `Totale Weekend: ${weekendTotal} punti`;

    }

}
/* ==========================================
   BOTTONI CALCOLO
========================================== */

function initializeButtons(){

    TABLES.forEach(config => {

        const map = {

            qp: "calculateQuali",

            sqp: "calculateSprintQuali",

            sp: "calculateSprintRace",

            rp: "calculateRace"

        };

        const buttonId = map[config.predictionPrefix];

        const button = document.getElementById(buttonId);

        if(!button) return;

        button.addEventListener("click", () => {

            calculateScore(config);

        });

    });

}

/* ==========================================
   CALCOLO TOTALE
========================================== */

function initializeTotalButton(){

    const button = document.getElementById("calculateTotal");

    if(!button) return;

    button.addEventListener("click", calculateAllScores);

}
/* ==========================================
   INIZIALIZZAZIONE ADMIN
========================================== */

async function initAdmin(){

    console.log("🚀 Avvio Admin...");

    /* Costruisce tutte le tabelle */

    buildTables();

    /* Blocca i piloti duplicati */

    initializeDuplicateProtection();

    /* Collega i pulsanti */

    initializeButtons();

    initializeTotalButton();

    /* Carica i risultati */

    initializeJSONButtons();
   
    await loadResults();

    /* Carica OpenF1 */

    if(typeof initAPI === "function"){

        await initAPI();

    }

    initializeMenu();

    initializeRules();
    
   showSection("home");
   
    console.log("✅ Admin pronto");

}

/* ==========================================
   AVVIO APPLICAZIONE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initAdmin();

    }

);
/* ==========================================
   OPENF1
========================================== */

async function loadWeekendData(){

    try{

        const response = await fetch(

            `${API_BASE}/meetings?year=2026`

        );

        const meetings = await response.json();

        if(!Array.isArray(meetings)) return;

        const now = new Date();

        currentMeeting = meetings.find(meeting =>

            new Date(meeting.date_start) > now

        );

        if(!currentMeeting){

            console.warn("Nessun GP trovato");

            return;

        }

        gpDate = new Date(currentMeeting.date_start);

        updateWeekendUI();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   AGGIORNA HOME
========================================== */

function updateWeekendUI(){

    if(!currentMeeting) return;

    const map = {

        gpName:
            `${currentMeeting.country_name} ${currentMeeting.meeting_name}`,

        gpCardName:
            `${currentMeeting.country_name} ${currentMeeting.meeting_name}`,

        gpCircuit:
            currentMeeting.circuit_short_name,

        gpCardWeekend:

            currentMeeting.meeting_name.includes("Sprint")

            ? "Weekend Sprint"

            : "Weekend Normale",

        weekendType:

            currentMeeting.meeting_name.includes("Sprint")

            ? "Weekend Sprint"

            : "Weekend Normale"

    };

    Object.entries(map).forEach(([id,value])=>{

        const el=document.getElementById(id);

        if(el) el.textContent=value;

    });

    const gpDateElement=document.getElementById("gpDate");

    if(gpDateElement){

        gpDateElement.textContent=

            new Date(currentMeeting.date_start)

            .toLocaleDateString(

                "it-IT",

                {

                    day:"numeric",

                    month:"long",

                    year:"numeric"

                }

            );

    }

    const status=document.getElementById("gpCardStatus");

    if(status){

        status.textContent="🟢 Pronostici aperti";

    }

    updateCountdown();

}

/* ==========================================
   COUNTDOWN
========================================== */

function updateCountdown(){

    if(!gpDate) return;

    const countdown=document.getElementById("countdown");

    if(!countdown) return;

    const now=new Date();

    const diff=gpDate-now;

    if(diff<=0){

        countdown.textContent="Weekend iniziato!";

        return;

    }

    const days=Math.floor(diff/(1000*60*60*24));

    const hours=Math.floor(

        (diff%(1000*60*60*24))

        /(1000*60*60)

    );

    const minutes=Math.floor(

        (diff%(1000*60*60))

        /(1000*60)

    );

    countdown.textContent=

        `${days}g ${hours}h ${minutes}m`;

}

setInterval(() => {

    if(gpDate){

        updateCountdown();

    }

},60000);

/* ==========================================
   API
========================================== */

async function initAPI(){

    await loadWeekendData();

}
/* ==========================================
   NAVIGAZIONE PANNELLI
========================================== */

function showSection(id){

    document.querySelectorAll(".panel").forEach(panel=>{

        panel.style.display="none";

    });

    const target=document.getElementById(id);

    if(target){

        target.style.display="block";

    }

    const sideMenu=document.getElementById("sideMenu");
    const menuToggle=document.getElementById("menuToggle");

    if(sideMenu){

        sideMenu.classList.remove("open");

    }

    if(menuToggle){

        menuToggle.classList.remove("active");

    }

}

/* ==========================================
   MENU HAMBURGER
========================================== */

function initializeMenu(){

    const menuToggle=document.getElementById("menuToggle");
    const sideMenu=document.getElementById("sideMenu");

    if(!menuToggle || !sideMenu) return;

    menuToggle.addEventListener("click",()=>{

        menuToggle.classList.toggle("active");

        sideMenu.classList.toggle("open");

    });

}

/* ==========================================
   REGOLAMENTO
========================================== */

function initializeRules(){

    const sections=document.querySelectorAll(".admin-panel");

    const links=document.querySelectorAll(".rules-index a");

    if(!sections.length) return;

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:0.15

    });

    sections.forEach(section=>{

        observer.observe(section);

    });

    window.addEventListener("scroll",()=>{

        let current="";

        sections.forEach(section=>{

            const top=section.offsetTop-150;

            if(window.scrollY>=top){

                current=section.id;

            }

        });

        links.forEach(link=>{

            link.classList.remove("active");

            if(link.getAttribute("href")==="#"+current){

                link.classList.add("active");

            }

        });

    });

}
/* ==========================================
   JSON RESULTS
========================================== */

function buildResultsJSON(){

    return {

        qualifying:getResultsArray("qr",5),

        sprintQualifying:getResultsArray("sqr",5),

        sprint:getResultsArray("sr",8),

        race:getResultsArray("rr",10)

    };

}

function getResultsArray(prefix,total){

    const results=[];

    for(let i=1;i<=total;i++){

        results.push(

            document.getElementById(`${prefix}${i}`)?.value || ""

        );

    }

    return results;

}

/* ==========================================
   ESPORTA JSON
========================================== */

function exportJSON(){

    const json=JSON.stringify(

        buildResultsJSON(),

        null,

        2

    );

    const output=document.getElementById("jsonOutput");

    if(output){

        output.value=json;

    }

}

/* ==========================================
   COPIA JSON
========================================== */

async function copyJSON(){

    const output=document.getElementById("jsonOutput");

    if(!output) return;

    await navigator.clipboard.writeText(output.value);

    alert("JSON copiato negli appunti!");

}

/* ==========================================
   DOWNLOAD JSON
========================================== */

function downloadJSON(){

    const json=document.getElementById("jsonOutput").value;

    const blob=new Blob(

        [json],

        {

            type:"application/json"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="results.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
   BOTTONI JSON
========================================== */

function initializeJSONButtons(){

    document

        .getElementById("generateJSON")

        ?.addEventListener(

            "click",

            exportJSON

        );

    document

        .getElementById("copyJSON")

        ?.addEventListener(

            "click",

            copyJSON

        );

    document

        .getElementById("downloadJSON")

        ?.addEventListener(

            "click",

            downloadJSON

        );

}
