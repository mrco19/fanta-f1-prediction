const DRIVER_NAMES = {

    1: "Lando NORRIS",
    3: "Max VERSTAPPEN",
    5: "Gabriel BORTOLETO",
    6: "Isack HADJAR",
    10: "Pierre GASLY",
    11: "Sergio PEREZ",
    12: "Kimi ANTONELLI",
    14: "Fernando ALONSO",
    16: "Charles LECLERC",
    18: "Lance STROLL",
    23: "Alexander ALBON",
    27: "Nico HULKENBERG",
    30: "Liam LAWSON",
    31: "Esteban OCON",
    41: "Arvin LINDBLAD",
    43: "Franco COLAPINTO",
    44: "Lewis HAMILTON",
    55: "Carlos SAINZ",
    63: "George RUSSELL",
    77: "Valtteri BOTTAS",
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

    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th style="width:70px;">Pos</th>
                    <th>Pilota</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 1; i <= total; i++) {

        let medal = i;

        if (i === 1) medal = "🥇";
        if (i === 2) medal = "🥈";
        if (i === 3) medal = "🥉";

        html += `
        <tr>

            <td class="pos">
                ${medal}
            </td>

            <td>

                <input
                    type="text"
                    id="${prefix}${i}"
                    class="result-field"
                    placeholder="Seleziona pilota"
                >

            </td>

        </tr>
        `;

    }

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;

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

    generateJson();
        
    alert(
        `✅ Caricata gara: ${lastRace.country_name}`
    );

} catch(error) {

    console.error(error);

    alert("Errore OpenF1");

}

});

document
.getElementById("loadSprintQuali")
?.addEventListener("click", async () => {

    try {

        const sessionResponse = await fetch(
            "https://api.openf1.org/v1/sessions?session_name=Sprint Qualifying"
        );

        const sessions =
            await sessionResponse.json();

        const pastSessions =
            sessions
                .filter(
                    s => new Date(s.date_start) < new Date()
                )
                .sort(
                    (a, b) =>
                        new Date(b.date_start) -
                        new Date(a.date_start)
                );

        const lastSession =
            pastSessions[0];

        const resultResponse = await fetch(
            `https://api.openf1.org/v1/session_result?session_key=${lastSession.session_key}`
        );

        const results =
            await resultResponse.json();

        results.sort(
            (a, b) => a.position - b.position
        );

        const top5 =
            results.filter(
                r =>
                    r.position !== null &&
                    r.position <= 5
            );

        for (let i = 0; i < top5.length; i++) {

            const driverNumber =
                top5[i].driver_number;

            const driverName =
                DRIVER_NAMES[driverNumber] ||
                `#${driverNumber}`;

            const field =
                document.getElementById(
                    `adminSqr${i + 1}`
                );

            if (field) {
                field.value = driverName;
            }

        }

        generateJson();
                
        alert(
            `✅ Sprint Qualifying ${lastSession.country_name} caricata`
        );

    } catch(error) {

        console.error(error);

        alert("Errore OpenF1");

    }

});

document
.getElementById("loadQuali")
?.addEventListener("click", async () => {

    try {

        const sessionResponse = await fetch(
            "https://api.openf1.org/v1/sessions?session_name=Qualifying"
        );

        const sessions =
            await sessionResponse.json();

        const pastQuali =
    sessions
        .filter(
            s => new Date(s.date_start) < new Date()
        )
        .sort(
            (a, b) =>
                new Date(b.date_start) -
                new Date(a.date_start)
        );

const lastQuali =
    pastQuali[0];

        const resultResponse = await fetch(
    `https://api.openf1.org/v1/session_result?session_key=${lastQuali.session_key}`
);

const results =
    await resultResponse.json();

results.sort(
    (a, b) => a.position - b.position
);

const top5 =
    results
        .filter(
            r =>
                r.position !== null &&
                r.position <= 5
        );

for (let i = 0; i < top5.length; i++) {

    const driverNumber =
        top5[i].driver_number;

    const driverName =
        DRIVER_NAMES[driverNumber] ||
        `#${driverNumber}`;

    const field =
        document.getElementById(
            `adminQr${i + 1}`
        );

    if (field) {
        field.value = driverName;
    }
}

        generateJson();
                
alert(
    `✅ Qualifiche ${lastQuali.country_name} caricate`
);
    } catch(error) {

        console.error(error);

        alert("Errore OpenF1");

    }

});

document
.getElementById("loadSprint")
?.addEventListener("click", async () => {

    try {

        const sessionResponse = await fetch(
            "https://api.openf1.org/v1/sessions?session_name=Sprint"
        );

        const sessions =
            await sessionResponse.json();

        const pastSessions =
            sessions
                .filter(
                    s => new Date(s.date_start) < new Date()
                )
                .sort(
                    (a, b) =>
                        new Date(b.date_start) -
                        new Date(a.date_start)
                );

        const lastSession =
            pastSessions[0];

        const resultResponse = await fetch(
            `https://api.openf1.org/v1/session_result?session_key=${lastSession.session_key}`
        );

        const results =
            await resultResponse.json();

        results.sort(
            (a, b) => a.position - b.position
        );

        const top8 =
            results.filter(
                r =>
                    r.position !== null &&
                    r.position <= 8
            );

        for (let i = 0; i < top8.length; i++) {

            const driverNumber =
                top8[i].driver_number;

            const driverName =
                DRIVER_NAMES[driverNumber] ||
                `#${driverNumber}`;

            const field =
                document.getElementById(
                    `adminSr${i + 1}`
                );

            if (field) {
                field.value = driverName;
            }

        }

        generateJson();
                
        alert(
            `✅ Sprint ${lastSession.country_name} caricata`
        );

    } catch(error) {

        console.error(error);

        alert("Errore OpenF1");

    }

});

function generateJson() {

    const data = {

        qualifying: [],
        sprintQualifying: [],
        sprint: [],
        race: []

    };

    for (let i = 1; i <= 5; i++) {

        data.qualifying.push(
            document.getElementById(`adminQr${i}`).value
        );

        data.sprintQualifying.push(
            document.getElementById(`adminSqr${i}`).value
        );

    }

    for (let i = 1; i <= 8; i++) {

        data.sprint.push(
            document.getElementById(`adminSr${i}`).value
        );

    }

    for (let i = 1; i <= 10; i++) {

        data.race.push(
            document.getElementById(`adminRr${i}`).value
        );

    }

    document.getElementById("jsonOutput").value =
        JSON.stringify(data, null, 4);

}
function downloadJson() {

    const text =
        document.getElementById("jsonOutput").value;

    const blob =
        new Blob(
            [text],
            {
                type: "application/json"
            }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "results.json";

    link.click();

    URL.revokeObjectURL(link.href);

}
document
.getElementById("generateJson")
?.addEventListener("click", generateJson);
document
.getElementById("copyJson")
?.addEventListener("click", async () => {

    const text =
        document.getElementById("jsonOutput").value;

    await navigator.clipboard.writeText(text);

    alert("✅ JSON copiato!");

});
document
.getElementById("downloadJson")
?.addEventListener("click", downloadJson);
