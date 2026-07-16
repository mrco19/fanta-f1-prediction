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
/* ==========================================================
   TEST CONNESSIONE GITHUB
========================================================== */

async function testGithubConnection(){

    const token = getGithubToken();

    if(token===""){

        alert("Inserisci il token.");

        return;

    }

    try{

        const response = await fetch(

            `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`,

                    Accept:"application/vnd.github+json"

                }

            }

        );

        if(response.ok){

            alert("✅ Connessione GitHub riuscita!");

        }else{

            alert("❌ Token non valido oppure repository non accessibile.");

        }

    }

    catch(error){

        console.error(error);

        alert("Errore di connessione.");

    }

}
/* ==========================================================
   TEST GITHUB
========================================================== */

const testButton = document.getElementById("testGithub");

if(testButton){

    testButton.addEventListener(

        "click",

        testGithubConnection

    );

}
/* ==========================================================
   LEGGE SHA FILE
========================================================== */

async function getFileSHA(path){

    const token = getGithubToken();

    const response = await fetch(

        `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${path}`,

        {

            headers:{

                Authorization:`Bearer ${token}`,

                Accept:"application/vnd.github+json"

            }

        }

    );

    if(!response.ok){

        throw new Error("SHA non trovato");

    }

    const data = await response.json();

    return data.sha;

}
/* ==========================================================
   CONVERTE TESTO IN BASE64
========================================================== */

function toBase64(text){

    return btoa(

        unescape(

            encodeURIComponent(text)

        )

    );

}
/* ==========================================================
   CARICA FILE SU GITHUB
========================================================== */

async function uploadFile(path, content, message){

    const token = getGithubToken();

    const sha = await getFileSHA(path);

    const response = await fetch(

        `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${path}`,

        {

            method:"PUT",

            headers:{

                Authorization:`Bearer ${token}`,

                Accept:"application/vnd.github+json",

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message,

                content:toBase64(content),

                branch:GITHUB.branch,

                sha

            })

        }

    );

    if(!response.ok){

        throw new Error("Errore upload");

    }

    return await response.json();

}
/* ==========================================================
   PUBBLICA WEEKEND.JSON
========================================================== */

async function publishWeekend(){

    try{

        const weekend = buildWeekendJSON();

        await uploadFile(

            "weekend.json",

            JSON.stringify(weekend,null,2),

            "Aggiornamento weekend"

        );

        alert("✅ weekend.json aggiornato su GitHub");

    }

    catch(error){

        console.error(error);

        alert("Errore durante il caricamento.");

    }

}
