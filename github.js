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
   TOKEN
========================================================== */

function getGithubToken(){

    return localStorage.getItem("githubToken") || "";

}

function saveGithubToken(token){

    localStorage.setItem(

        "githubToken",

        token

    );

}
/* ==========================================================
   SALVA TOKEN
========================================================== */

const saveButton = document.getElementById(

    "saveGithubToken"

);

if(saveButton){

    saveButton.addEventListener(

        "click",

        ()=>{

            const token =

                document

                .getElementById("githubToken")

                .value

                .trim();

            if(token===""){

                alert("Inserisci il token.");

                return;

            }

            saveGithubToken(token);

            alert("✅ Token salvato.");

        }

    );

}
/* ==========================================================
   CARICA TOKEN
========================================================== */

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        const token = getGithubToken();

        const input =

            document.getElementById(

                "githubToken"

            );

        if(input){

            input.value = token;

        }

    }

);
