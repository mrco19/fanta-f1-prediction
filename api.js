/* ==========================================
   API FORMULA 1
========================================== */

async function loadWeekendData() {

    try{

        const response = await fetch("https://api.openf1.org/v1/meetings?year=2026");

        const meetings = await response.json();

        console.log(meetings);

    }catch(error){

        console.error(error);

    }

}

loadWeekendData();
