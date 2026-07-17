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

        "I file JSON sono pronti per il commit."

    );

}
