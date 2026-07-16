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
