const DRIVER_NAMES = {

    1: "Max VERSTAPPEN",
    4: "Lando NORRIS",
    5: "Gabriel BORTOLETO",
    6: "Isack HADJAR",
    7: "Jack DOOHAN",
    10: "Pierre GASLY",
    12: "Kimi ANTONELLI",
    14: "Fernando ALONSO",
    16: "Charles LECLERC",
    18: "Lance STROLL",
    22: "Yuki TSUNODA",
    23: "Alexander ALBON",
    27: "Nico HULKENBERG",
    30: "Liam LAWSON",
    31: "Esteban OCON",
    43: "Franco COLAPINTO",
    44: "Lewis HAMILTON",
    55: "Carlos SAINZ",
    63: "George RUSSELL",
    81: "Oscar PIASTRI",
    87: "Oliver BEARMAN"

};
const adminQuali =
    document.getElementById("admin-quali");

const adminSprintQuali =
    document.getElementById("admin-sprintquali");

const adminSprint =
    document.getElementById("admin-sprint");

const adminRace =
    document.getElementById("admin-race");

function createAdminInputs(container, prefix, total) {

    if (!container) return;

    for (let i = 1; i <= total; i++) {

        let label = `${i}°`;

        if (i === 1) label = "🏆 1°";
        if (i === 2) label = "🥈 2°";
        if (i === 3) label = "🥉 3°";

        container.innerHTML += `
            <div class="result-row">
                <span>${label}</span>
                <input id="${prefix}${i}" class="result-field">
            </div>
        `;
    }
}

createAdminInputs(adminQuali, "adminQr", 5);
createAdminInputs(adminSprintQuali, "adminSqr", 5);
createAdminInputs(adminSprint, "adminSr", 8);
createAdminInputs(adminRace, "adminRr", 10);
document
.getElementById("loadRace")
?.addEventListener("click", async () => {

    try {

        const response = await fetch(
            "https://api.openf1.org/v1/sessions?session_name=Race"
        );

        const sessions = await response.json();

        console.log(sessions);

    } catch(error) {

        console.error(error);

    }

});
document
.getElementById("loadRace")
?.addEventListener("click", async () => {

try {

    // Ultima gara disputata
    const sessionResponse = await fetch(
        "https://api.openf1.org/v1/sessions?session_name=Race"
    );

    const sessions =
        await sessionResponse.json();

    const pastRaces =
        sessions.filter(
            s => new Date(s.date_start) < new Date()
        );

    const lastRace =
        pastRaces[pastRaces.length - 1];
    console.log(lastRace);

    // Classifica finale gara
    const resultResponse = await fetch(
        `https://api.openf1.org/v1/session_result?session_key=${lastRace.session_key}`
    );

    const results =
        await resultResponse.json();
    console.log("RESULTS");
console.table(results);

    // Ordina per posizione
    results.sort(
        (a, b) => a.position - b.position
    );

    // Solo Top 10
    const top10 =
        results.filter(r => r.position <= 10);

  
for (let i = 0; i < top10.length; i++) {

    const driverNumber =
        top10[i].driver_number;

   const driverName =
    DRIVER_NAMES[driverNumber] ||
    `#${driverNumber}`;

    const field =
        document.getElementById(
            `adminRr${i + 1}`
        );

    if (field) {
        field.value = driverName;
    }
}

    alert(
    `${lastRace.country_name} - ${lastRace.session_name}`
);

} catch(error) {

    console.error(error);

    alert("Errore OpenF1");

}

});

