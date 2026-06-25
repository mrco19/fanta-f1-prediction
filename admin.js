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

    const sessionResponse = await fetch(
        "https://api.openf1.org/v1/sessions?session_name=Race"
    );

    const sessions =
        await sessionResponse.json();

    const pastRaces =
        sessions
            .filter(
                s => new Date(s.date_start) < new Date()
            )
            .sort(
                (a, b) =>
                    new Date(b.date_start) -
                    new Date(a.date_start)
            );

    const lastRace = pastRaces[0];
    console.log(
    "SESSION KEY:",
    lastRace.session_key
);

    console.log("LAST RACE");
    console.log(lastRace);

    const resultResponse = await fetch(
        `https://api.openf1.org/v1/session_result?session_key=${lastRace.session_key}`
    );

    const results =
        await resultResponse.json();
    console.log(results.length);

    console.table(results);

    results.sort(
        (a, b) => a.position - b.position
    );

    const top10 =
    results
        .filter(
            r =>
                r.position !== null &&
                r.position <= 10
        )
        .sort(
            (a, b) => a.position - b.position
        );

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

console.log(
    "POS:",
    i + 1,
    "NUM:",
    driverNumber,
    "NOME:",
    driverName
);

if (field) {
    field.value = driverName;
}
    }

    alert(
        `✅ Caricata gara: ${lastRace.country_name}`
    );

} catch(error) {

    console.error(error);

    alert("Errore OpenF1");

}

});


