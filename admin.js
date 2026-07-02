const API_BASE = "https://api.openf1.org/v1";

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
   SAFE GET
========================= */

function el(id) {
  return document.getElementById(id);
}

/* =========================
   CREA INPUTS
========================= */

function createInputs(containerId, prefix, total) {
  const container = el(containerId);
  if (!container) return;

  container.innerHTML = "";

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

/* =========================
   INIT UI (SOLO ADMIN)
========================= */

function initAdminUI() {
  createInputs("admin-quali", "adminQr", 5);
  createInputs("admin-sprintquali", "adminSqr", 5);
  createInputs("admin-sprint", "adminSr", 8);
  createInputs("admin-race", "adminRr", 10);
}

/* =========================
   LOAD OPENF1 SESSION
========================= */

async function loadSession(sessionName, prefix, limit) {
  try {
    const res = await fetch(`${API_BASE}/sessions?session_name=${sessionName}`);
    const sessions = await res.json();

    const past = sessions
      .filter(s => new Date(s.date_start) < new Date())
      .sort((a, b) => new Date(b.date_start) - new Date(a.date_start));

    if (!past.length) return;

    const last = past[0];

    const res2 = await fetch(
      `${API_BASE}/session_result?session_key=${last.session_key}`
    );

    const results = await res2.json();

    results.sort((a, b) => a.position - b.position);

    const top = results
      .filter(r => r.position && r.position <= limit);

    for (let i = 0; i < top.length; i++) {
      const driverName =
        DRIVER_NAMES[top[i].driver_number] ||
        `#${top[i].driver_number}`;

      const field = el(`${prefix}${i + 1}`);
      if (field) field.value = driverName;
    }

  } catch (err) {
    console.error("Errore API:", err);
  }
}

/* =========================
   GENERA JSON
========================= */

function generateJson() {
  const data = {
    qualifying: [],
    sprintQualifying: [],
    sprint: [],
    race: []
  };

  for (let i = 1; i <= 5; i++) {
    data.qualifying.push(el(`adminQr${i}`)?.value || "");
    data.sprintQualifying.push(el(`adminSqr${i}`)?.value || "");
  }

  for (let i = 1; i <= 8; i++) {
    data.sprint.push(el(`adminSr${i}`)?.value || "");
  }

  for (let i = 1; i <= 10; i++) {
    data.race.push(el(`adminRr${i}`)?.value || "");
  }

  el("jsonOutput").value = JSON.stringify(data, null, 4);
}

/* =========================
   DOWNLOAD JSON
========================= */

function downloadJson() {
  const text = el("jsonOutput").value;

  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "results.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   EVENTS
========================= */

function bindEvents() {
  el("loadQuali")?.addEventListener("click", async () => {
    await loadSession("Qualifying", "adminQr", 5);
    generateJson();
    alert("Qualifiche caricate");
  });

  el("loadSprintQuali")?.addEventListener("click", async () => {
    await loadSession("Sprint Qualifying", "adminSqr", 5);
    generateJson();
    alert("Sprint Qualifying caricate");
  });

  el("loadSprint")?.addEventListener("click", async () => {
    await loadSession("Sprint", "adminSr", 8);
    generateJson();
    alert("Sprint caricato");
  });

  el("loadRace")?.addEventListener("click", async () => {
    await loadSession("Race", "adminRr", 10);
    generateJson();
    alert("Gara caricata");
  });

  el("generateJson")?.addEventListener("click", generateJson);
  el("downloadJson")?.addEventListener("click", downloadJson);

  el("copyJson")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(el("jsonOutput").value);
    alert("JSON copiato");
  });
}

/* =========================
   START SAFE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initAdminUI();
  bindEvents();
});
