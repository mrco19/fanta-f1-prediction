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

        const resultResponse = await fetch(
            `https://api.openf1.org/v1/session_result?session_key=${lastRace.session_key}`
        );

        const results =
            await resultResponse.json();

        console.log(results);

        const driversResponse = await fetch(
    "https://api.openf1.org/v1/drivers"
);

const drivers =
    await driversResponse.json();

console.log(drivers);

        alert(
            "Risultati trovati: " +
            results.length
        );

    } catch(error) {

        console.error(error);

        alert("Errore OpenF1");

    }

});

