"use strict";

/* ==========================================================
   GITHUB API
   FANTA F1 PREDICTION
========================================================== */
"use strict";

/* ==========================================================
   GITHUB
========================================================== */

const GITHUB = {

    owner: "mrco19",

    repo: "fanta-f1-prediction",

    branch: "main"

};

/* ==========================================================
   GITHUB.JS 2.0
   Utility pubblicazione
========================================================== */

/*
    Questo file NON usa più le GitHub API.

    La pubblicazione avverrà tramite:

    Admin
        ↓
    GitHub Desktop
        ↓
    Commit
        ↓
    Push
        ↓
    GitHub Action
*/

/* ==========================================================
   MESSAGGI
========================================================== */

function githubInfo(message){

    console.log("GitHub:", message);

}

function githubError(message){

    console.error("GitHub:", message);

    alert(message);

}

/* ==========================================================
   STATO PUBBLICAZIONE
========================================================== */

function publicationReady(){

    githubInfo(

        "I file JSON sono pronti."

    );

    const status =

        document.getElementById(

            "publicationStatus"

        );

    if(status){

        status.innerHTML =

        "🟢 Tutto pronto per Commit e Push";

    }

}
/* ==========================================================
   CONTROLLI PUBBLICAZIONE
========================================================== */

/* ==========================================================
   CONTROLLI PUBBLICAZIONE
========================================================== */

function validatePublication(){

    const errors = [];

    /* -------------------------
       Funzioni presenti
    ------------------------- */

    if(typeof buildWeekendJSON !== "function"){

        errors.push("❌ Weekend non disponibile");

    }

    if(typeof buildResultsJSON !== "function"){

        errors.push("❌ Risultati non disponibili");

    }

    if(typeof buildRankingJSON !== "function"){

        errors.push("❌ Classifica non disponibile");

    }

    /* -------------------------
       Weekend
    ------------------------- */

    if(errors.length===0){

        const weekend = buildWeekendJSON();

        if(!weekend.name){

            errors.push("❌ Nome GP mancante");

        }

        if(!weekend.round){

            errors.push("❌ Round mancante");

        }

        if(!weekend.startDate){

            errors.push("❌ Data inizio mancante");

        }

        if(!weekend.endDate){

            errors.push("❌ Data fine mancante");

        }

    }
   /* -------------------------
   Risultati
------------------------- */

if(errors.length===0){

    const results = buildResultsJSON();

    if(results.qualifying.length !== 5){

        errors.push("❌ Qualifica incompleta");

    }

    if(results.race.length !== 10){

        errors.push("❌ Gara incompleta");

    }

    const weekend = buildWeekendJSON();

    if(weekend.sprint){

        if(results.sprintQualifying.length !== 5){

            errors.push("❌ Sprint Qualifying incompleta");

        }

        if(results.sprint.length !== 8){

            errors.push("❌ Sprint Race incompleta");

        }

    }

}

    return{

        valid: errors.length===0,

        errors

    };

}
/* ==========================================================
   PULSANTE PUBBLICA
========================================================== */

function publishProject(){

    const validation = validatePublication();

    if(!validation.valid){

        githubError(

            validation.errors.join("\n")

        );

        return;

    }

    publicationReady();

    alert(

`✅ Tutto è pronto.

1. Apri GitHub Desktop

2. Scrivi il commit

3. Premi Push

Il sito verrà aggiornato automaticamente.`

    );

}
/* ==========================================================
   EVENTO PULSANTE PUBBLICA
========================================================== */

const publishButton =

document.getElementById(

    "publishProject"

);

if(publishButton){

    publishButton.addEventListener(

        "click",

        publishProject

    );

}
