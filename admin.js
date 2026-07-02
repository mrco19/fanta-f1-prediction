/* =========================
   DRIVER MAP
========================= */

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

/* =========================
   CONTENITORI
========================= */

const adminQuali = document.getElementById("admin-quali");
const adminSprintQuali = document.getElementById("admin-sprintquali");
const adminSprint = document.getElementById("admin-sprint");
const adminRace = document.getElementById("admin-race");

/* =========================
   INPUT GENERATOR STABILE
========================= */

function createAdminInputs(container, prefix, total) {
    if (!container) return;

    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Pos</th>
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
                <td>${medal}</td>
                <td>
                    <input type="text" id="${prefix}${i}" class="result-field">
                </td>
            </tr>
        `;
    }

    html += `</tbody></table>`;

    container.innerHTML = html;
}

/* =========================
   INIT INPUTS
========================= */

createAdminInputs(adminQuali, "adminQr", 5);
createAdminInputs(adminSprintQuali, "adminSqr", 5);
createAdminInputs(adminSprint, "adminSr", 8);
createAdminInputs(adminRace, "adminRr", 10);

/* =========================
   LOAD OPENF1 FUNCTION
========================= */

async function loadSession(sessionName, prefix, limit, label) {
    try {
        const res = await fetch(
            `https://api.openf1.org/v1/sessions?session_name=${sessionName}`
        );

        const sessions = await res.json();

        const past = sessions
            .filter(s => new Date(s.date_start) < new Date())
            .sort((a, b) => new Date(b.date_start) - new Date(a.date_start));

        const last = past[0];
        if (!last) throw new Error("Session non trovata");

        const res2 = await fetch(
            `https://api.openf1.org/v1/session_result?session_key=${last.session_key}`
        );

        const results = await res2.json();
        results.sort((a, b) => a.position - b.position);

        const top = results.filter(r => r.position && r.position <= limit);

        top.forEach((r, i) => {
            const name = DRIVER_NAMES[r.driver_number] || `#${r.driver_number}`;
            const field = document.getElementById(`${prefix}${i + 1}`);

            if (field) field.value = name;
        });

        generateJson();

        alert(`✅ ${label} caricata`);

    } catch (err) {
        console.error(err);
        alert("Errore OpenF1");
    }
}

/* =========================
   BUTTONS OPENF1
========================= */

document.getElementById("loadRace")
?.addEventListener("click", () =>
    loadSession("Race", "adminRr", 10, "Gara")
);

document.getElementById("loadSprint")
?.addEventListener("click", () =>
    loadSession("Sprint", "adminSr", 8, "Sprint")
);

document.getElementById("loadQuali")
?.addEventListener("click", () =>
    loadSession("Qualifying", "adminQr", 5, "Qualifiche")
);

document.getElementById("loadSprintQuali")
?.addEventListener("click", () =>
    loadSession("Sprint Qualifying", "adminSqr", 5, "Sprint Qualifying")
);

/* =========================
   JSON GENERATION
========================= */

function generateJson() {
    const data = {
        qualifying: [],
        sprintQualifying: [],
        sprint: [],
        race: []
    };

    for (let i = 1; i <= 5; i++) {
        data.qualifying.push(document.getElementById(`adminQr${i}`)?.value || "");
        data.sprintQualifying.push(document.getElementById(`adminSqr${i}`)?.value || "");
    }

    for (let i = 1; i <= 8; i++) {
        data.sprint.push(document.getElementById(`adminSr${i}`)?.value || "");
    }

    for (let i = 1; i <= 10; i++) {
        data.race.push(document.getElementById(`adminRr${i}`)?.value || "");
    }

    const output = document.getElementById("jsonOutput");
    if (output) output.value = JSON.stringify(data, null, 4);
}

/* =========================
   EXPORT JSON
========================= */

function downloadJson() {
    const text = document.getElementById("jsonOutput")?.value || "";

    const blob = new Blob([text], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "results.json";
    link.click();

    URL.revokeObjectURL(link.href);
}

/* =========================
   BUTTON JSON
========================= */

document.getElementById("generateJson")
?.addEventListener("click", generateJson);

document.getElementById("copyJson")
?.addEventListener("click", async () => {
    const text = document.getElementById("jsonOutput")?.value || "";
    await navigator.clipboard.writeText(text);
    alert("✅ JSON copiato!");
});

document.getElementById("downloadJson")
?.addEventListener("click", downloadJson);

}); // END DOMContentLoaded
