const drivers = [
  "Max VERSTAPPEN",
  "Lando NORRIS",
  "Charles LECLERC",
  "Oscar PIASTRI",
  "George RUSSELL",
  "Lewis HAMILTON",
  "Carlos SAINZ",
  "Fernando ALONSO",
  "Lance STROLL",
  "Pierre GASLY",
  "Esteban OCON",
  "Isack HADJAR",
  "Alexander ALBON",
  "Nico HULKENBERG",
  "Valtteri BOTTAS",
  "Gabriel BORTOLETO",
  "Liam LAWSON",
  "Arvin LINDBLAD",
  "Oliver BEARMAN",
  "Franco COLAPINTO",
  "Sergio PEREZ",
  "Kimi ANTONELLI"
];

const driversSorted = [...drivers].sort((a, b) =>
  a.localeCompare(b)
);

/* =========================
   CONTENITORI DOM
========================= */

const qualiContainer =
  document.getElementById("quali-predictions");

const qualiResults =
  document.getElementById("quali-results");

const sprintQualiPredictions =
  document.getElementById("sprintquali-predictions");

const sprintQualiResults =
  document.getElementById("sprintquali-results");

const sprintPredictions =
  document.getElementById("sprint-predictions");

const sprintResults =
  document.getElementById("sprint-results");

const racePredictions =
  document.getElementById("race-predictions");

const raceResults =
  document.getElementById("race-results");

/* =========================
   GENERAZIONE QUALIFICHE
========================= */

for (let i = 1; i <= 5; i++) {

  const options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(
      d => `<option value="${d}">${d}</option>`
    ).join("");

  qualiContainer.innerHTML += `
    <div class="input-row">
      <span>${i}°</span>
      <select id="qp${i}" class="driver-select">
        ${options}
      </select>
    </div>
  `;

 qualiResults.innerHTML += `
  <div class="result-row">
    <span id="qrPos${i}">${i}°</span>
    <input id="qr${i}" class="result-field" readonly>
  </div>
`;
}

/* =========================
   GENERAZIONE SPRINT QUALIFYING
========================= */

for (let i = 1; i <= 5; i++) {

  const options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(
      d => `<option value="${d}">${d}</option>`
    ).join("");

  sprintQualiPredictions.innerHTML += `
    <div class="input-row">
      <span>${i}°</span>
      <select id="sqp${i}" class="driver-select">
        ${options}
      </select>
    </div>
  `;

  sprintQualiResults.innerHTML += `
  <div class="result-row">
   <span id="sqrPos${i}">${i}°</span>
    <input id="sqr${i}" class="result-field" readonly>
  </div>
`;
}

/* =========================
   GENERAZIONE SPRINT RACE
========================= */

for (let i = 1; i <= 8; i++) {

  const options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(
      d => `<option value="${d}">${d}</option>`
    ).join("");

  sprintPredictions.innerHTML += `
    <div class="input-row">
      <span>${i}°</span>
      <select id="sp${i}" class="driver-select">
        ${options}
      </select>
    </div>
  `;

  sprintResults.innerHTML += `
  <div class="result-row">
    <span id="srPos${i}">${i}°</span>
    <input id="sr${i}" class="result-field" readonly>
  </div>
`;
}

/* =========================
   GENERAZIONE GARA
========================= */

for (let i = 1; i <= 10; i++) {

  const options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(
      d => `<option value="${d}">${d}</option>`
    ).join("");

  racePredictions.innerHTML += `
    <div class="input-row">
      <span>${i}°</span>
      <select id="rp${i}" class="driver-select">
        ${options}
      </select>
    </div>
  `;

  raceResults.innerHTML += `
  <div class="result-row">
    <span id="rrPos${i}">${i}°</span>
    <input id="rr${i}" class="result-field" readonly>
  </div>
`;
}

/* =========================
   BLOCCO DUPLICATI
========================= */

function getSelectsInContainer(containerId) {

  const container =
    document.getElementById(containerId);

  if (!container) return [];

  return Array.from(
    container.querySelectorAll(".driver-select")
  );
}

function updateDriverLocks(containerId) {

  const selects =
    getSelectsInContainer(containerId);

  selects.forEach(select => {

    Array.from(select.options).forEach(option => {
      option.disabled = false;
    });

  });

  const selectedDrivers = selects
    .map(select => select.value)
    .filter(value => value !== "");

  selects.forEach(select => {

    Array.from(select.options).forEach(option => {

      if (option.value === "") return;

      if (
        selectedDrivers.includes(option.value) &&
        option.value !== select.value
      ) {
        option.disabled = true;
      }

    });

  });
}

/* =========================
   AVVIO PAGINA
========================= */

const containers = [
  "quali-predictions",
  "quali-results",
  "sprintquali-predictions",
  "sprintquali-results",
  "sprint-predictions",
  "sprint-results",
  "race-predictions",
  "race-results"
];

containers.forEach(containerId => {

  const selects =
    getSelectsInContainer(containerId);

  selects.forEach(select => {

    select.addEventListener("change", () => {
      updateDriverLocks(containerId);
    });

  });

  updateDriverLocks(containerId);

});

/* =========================
   PUNTEGGI QUALIFICHE
========================= */

const qualiBonus = {
  1: 10,
  2: 8,
  3: 6,
  4: 4,
  5: 2
};
/* =========================
   SPRINT RACE
========================= */

const sprintRacePoints = {
  1: 8,
  2: 7,
  3: 6,
  4: 5,
  5: 4,
  6: 3,
  7: 2,
  8: 1
};

/* =========================
   GARA
========================= */

const racePoints = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1
};

/* =========================
   FUNZIONE GENERICA PUNTEGGI
========================= */

function calculateScore({
  predictionPrefix,
  resultPrefix,
  positions,
  pointsTable,
  wrongPositionPoints,
  scoreElement,
  detailElement
}) {

  let score = 0;
  let details = "";

  const prediction = [];
  const result = [];

  for (let i = 1; i <= positions; i++) {

    prediction.push(
      document.getElementById(`${predictionPrefix}${i}`)
        ?.value
        ?.trim()
        .toLowerCase() || ""
    );

    result.push(
      document.getElementById(`${resultPrefix}${i}`)
        ?.value
        ?.trim()
        .toLowerCase() || ""
    );
  }

  for (let i = 0; i < positions; i++) {

    const driver = prediction[i];

    if (driver === result[i]) {

      const pts = pointsTable[i + 1] || 0;

      score += pts;

      details +=
        `${i + 1}° ${driver} ✔️ +${pts}<br>`;

    } else if (
      result.includes(driver) &&
      driver !== ""
    ) {

      score += wrongPositionPoints;

      details +=
        `${i + 1}° ${driver} ✔️ +${wrongPositionPoints}<br>`;

    } else {

      details +=
        `${i + 1}° ${driver} ❌ +0<br>`;
    }
  }

  document.getElementById(scoreElement).textContent =
    `${score} punti`;

  document.getElementById(detailElement).innerHTML =
    details;

  return score;
}
/* =========================
   FUNZIONI CALCOLO
========================= */

function calculateQuali() {

  return calculateScore({
    predictionPrefix: "qp",
    resultPrefix: "qr",
    positions: 5,
    pointsTable: qualiBonus,
    wrongPositionPoints: 1,
    scoreElement: "qualiScore",
    detailElement: "qualiDetail"
  });

}

function calculateSprintQuali() {

  return calculateScore({
    predictionPrefix: "sqp",
    resultPrefix: "sqr",
    positions: 5,
    pointsTable: qualiBonus,
    wrongPositionPoints: 1,
    scoreElement: "sprintQualiScore",
    detailElement: "sprintQualiDetail"
  });

}

function calculateSprintRace() {

  return calculateScore({
    predictionPrefix: "sp",
    resultPrefix: "sr",
    positions: 8,
    pointsTable: sprintRacePoints,
    wrongPositionPoints: 1, // metti 2 se vuoi come la gara
    scoreElement: "sprintRaceScore",
    detailElement: "sprintRaceDetail"
  });

}

function calculateRace() {

  return calculateScore({
    predictionPrefix: "rp",
    resultPrefix: "rr",
    positions: 10,
    pointsTable: racePoints,
    wrongPositionPoints: 2,
    scoreElement: "raceScore",
    detailElement: "raceDetail"
  });

}
/* =========================
   BOTTONI
========================= */

document
  .getElementById("calculateQuali")
  .addEventListener("click", calculateQuali);

document
  .getElementById("calculateSprintQuali")
  .addEventListener("click", calculateSprintQuali);

document
  .getElementById("calculateSprintRace")
  .addEventListener("click", calculateSprintRace);

document
  .getElementById("calculateRace")
  .addEventListener("click", calculateRace);

/* =========================
   TOTALE WEEKEND
========================= */

document
  .getElementById("calculateTotal")
  .addEventListener("click", () => {

    const total =
      calculateQuali() +
      calculateSprintQuali() +
      calculateSprintRace() +
      calculateRace();

    document.getElementById("totalScore").textContent =
      `Totale Weekend: ${total} punti`;

  });

/* =========================
   MENU
========================= */

function showSection(id) {

    document.querySelectorAll(".panel").forEach(panel => {
        panel.style.display = "none";
    });

    const target = document.getElementById(id);

    if (target) {
        target.style.display = "block";
    }

    if (sideMenu) {
        sideMenu.classList.remove("open");
    }

    if (menuToggle) {
        menuToggle.classList.remove("active");
    }

}

/* =========================
   MENU HAMBURGER
========================= */

const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");

if (menuToggle && sideMenu) {

    menuToggle.addEventListener("click", () => {

        menuToggle.classList.toggle("active");
        sideMenu.classList.toggle("open");

    });

}

showSection("home");

/* =========================
   CARICAMENTO RISULTATI
========================= */

async function loadResults() {

    const response = await fetch("results.json");
    const data = await response.json();

    setResultPositions("qr", data.qualifying);
    setResultPositions("sqr", data.sprintQualifying);
    setResultPositions("sr", data.sprint);
    setResultPositions("rr", data.race);

}

function setResultPositions(prefix, results) {

    results.forEach((driver, index) => {

        const field = document.getElementById(`${prefix}${index + 1}`);
        const pos = document.getElementById(`${prefix}Pos${index + 1}`);

        if (!field) return;

        field.value = driver;

        if (pos) {

            if (index === 0) {

                pos.textContent = "🏆 1°";

            } else if (index === 1) {

                pos.textContent = "🥈 2°";

            } else if (index === 2) {

                pos.textContent = "🥉 3°";

            } else {

                pos.textContent = `${index + 1}°`;

            }

        }

    });

}

loadResults();

/* =========================
   REGOLAMENTO
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".admin-panel");
    const links = document.querySelectorAll(".rules-index a");

    if (sections.length === 0) return;

    /* Animazione comparsa */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    sections.forEach(section => observer.observe(section));

    /* Evidenzia indice */

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;

            if (window.scrollY >= top) {

                current = section.id;

            }

        });

        links.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

});
