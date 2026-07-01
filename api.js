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

    } catch(error) {

        console.error(error);

    }

}

loadWeekendData();
