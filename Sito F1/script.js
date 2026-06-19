const drivers = [
  "Verstappen",
  "Norris",
  "Leclerc",
  "Piastri",
  "Russell",
  "Hamilton",
  "Sainz",
  "Alonso",
  "Stroll",
  "Gasly",
  "Ocon",
  "Hadjar",
  "Albon",
  "Hülkenberg",
  "Bottas",
  "Bortoleto",
  "Lawson",
  "Lindblad",
  "Bearman",
  "Colapinto",
  "Perez",
  "Antonelli"
];

const driversSorted = [...drivers].sort();

/* =========================
   CONTENITORI DOM
========================= */
const qualiContainer = document.getElementById("quali-predictions");
const qualiResults = document.getElementById("quali-results");

const racePredictions = document.getElementById("race-predictions");
const raceResults = document.getElementById("race-results");

/* =========================
   GENERAZIONE SELECT QUALIFICHE
========================= */
for (let i = 1; i <= 5; i++) {

  let options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(d => `<option value="${d}">${d}</option>`).join("");

  qualiContainer.innerHTML += `
    <div class="input-row">
        <span>${i}°</span>
        <select id="qp${i}" class="driver-select">
            ${options}
        </select>
    </div>`;

  qualiResults.innerHTML += `
    <div class="input-row">
        <span>${i}°</span>
        <select id="qr${i}" class="driver-select">
            ${options}
        </select>
    </div>`;
}

/* =========================
   GENERAZIONE SELECT GARA
========================= */
for (let i = 1; i <= 10; i++) {

  let options =
    `<option value="">Seleziona pilota</option>` +
    driversSorted.map(d => `<option value="${d}">${d}</option>`).join("");

  racePredictions.innerHTML += `
    <div class="input-row">
        <span>${i}°</span>
        <select id="rp${i}" class="driver-select">
            ${options}
        </select>
    </div>`;

  raceResults.innerHTML += `
    <div class="input-row">
        <span>${i}°</span>
        <select id="rr${i}" class="driver-select">
            ${options}
        </select>
    </div>`;
}

/* =========================
   BLOCCO DUPLICATI PILOTI
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

  // reset opzioni
  selects.forEach(select => {

    Array.from(select.options).forEach(option => {
      option.disabled = false;
    });

  });

  // piloti selezionati
  const selectedDrivers = selects
    .map(select => select.value)
    .filter(value => value !== "");

  // blocca duplicati
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

document.addEventListener("DOMContentLoaded", () => {

  const containers = [
    "quali-predictions",
    "quali-results",
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

  showSection("app");

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

function calculateQuali() {

  let score = 0;
  let details = "";

  const prediction = [];
  const result = [];

  for (let i = 1; i <= 5; i++) {

    prediction.push(
      document.getElementById(`qp${i}`).value?.trim().toLowerCase() || ""
    );

    result.push(
      document.getElementById(`qr${i}`).value?.trim().toLowerCase() || ""
    );
  }

  for (let i = 0; i < 5; i++) {

    const driver = prediction[i];

    if (driver === result[i]) {
      const pts = qualiBonus[i + 1];
      score += pts;
      details += `${i + 1}° ${driver} ✔️ +${pts}<br>`;
    }
    else if (result.includes(driver) && driver !== "") {
      score += 1;
      details += `${i + 1}° ${driver} ✔️ (posizione sbagliata) +1<br>`;
    }
    else {
      details += `${i + 1}° ${driver} ❌ +0<br>`;
    }
  }

  document.getElementById("qualiScore").textContent = `${score} punti`;
  document.getElementById("qualiDetail").innerHTML = details;

  return score;
}

/* =========================
   PUNTEGGI GARA
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

function calculateRace() {

  let score = 0;
  let details = "";

  const prediction = [];
  const result = [];

  for (let i = 1; i <= 10; i++) {

    prediction.push(
      document.getElementById(`rp${i}`).value?.trim().toLowerCase() || ""
    );

    result.push(
      document.getElementById(`rr${i}`).value?.trim().toLowerCase() || ""
    );
  }

  for (let i = 0; i < 10; i++) {

    const driver = prediction[i];

    if (driver === result[i]) {
      const pts = racePoints[i + 1];
      score += pts;
      details += `${i + 1}° ${driver} ✔️ +${pts}<br>`;
    }
    else if (result.includes(driver) && driver !== "") {
      score += 2;
      details += `${i + 1}° ${driver} ✔️ (posizione sbagliata) +2<br>`;
    }
    else {
      details += `${i + 1}° ${driver} ❌ +0<br>`;
    }
  }

  document.getElementById("raceScore").textContent = `${score} punti`;
  document.getElementById("raceDetail").innerHTML = details;

  return score;
}

/* =========================
   BOTTONI
========================= */
document.getElementById("calculateQuali")
.addEventListener("click", calculateQuali);

document.getElementById("calculateRace")
.addEventListener("click", calculateRace);

document.getElementById("calculateTotal")
.addEventListener("click", () => {

  const total = calculateQuali() + calculateRace();

  document.getElementById("totalScore")
    .textContent = `Totale Weekend: ${total} punti`;
});

/* =========================
   MENU
========================= */
function showSection(id) {

  document
    .querySelectorAll(".panel")
    .forEach(panel => {
      panel.style.display = "none";
    });

  const target =
    document.getElementById(id);

  if(target){
    target.style.display = "block";
  }

  if(sideMenu){
    sideMenu.classList.remove("open");
  }

  if(menuToggle){
    menuToggle.classList.remove("active");
  }

}
/* =========================
   MENU HAMBURGER
========================= */

const menuToggle =
document.getElementById("menuToggle");

const sideMenu =
document.getElementById("sideMenu");

if (menuToggle && sideMenu) {

  menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");

    sideMenu.classList.toggle("open");

  });

}