// URL zu deinem veröffentlichten Google Sheet (CSV Export)
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn9sbmbzT81t1KJQalXVr1agr9E4WUXBOTKrwMWNGimD9CnbCXD2Z2WQzpDMZKl0GVQOKI8mELb3Y0/pub?output=csv";

// DOM
const inputName = document.getElementById("workerName");
const btnWeiter = document.getElementById("goBtn");
const resultBox = document.getElementById("result");

// Nutzer klickt WEITER
btnWeiter.addEventListener("click", () => {
  const name = inputName.value.trim();
  if (name.length < 2) {
    alert("Bitte deinen Nachnamen eingeben.");
    return;
  }
  loadCsv(name);
});

// CSV LADEN + FILTER
async function loadCsv(name) {
  try {
    const res = await fetch(CSV_URL);
    const csv = await res.text();

    const rows = csv.split("\n").map((r) => r.split(","));
    const headers = rows[0];

    // *** WICHTIG: GENAUE SPALTENNAMEN ***
    const idxMonteur = headers.indexOf("Monteur / Team");
    const idxProjekt = headers.indexOf("Projekt/ Baustelle");
    const idxDatum = headers.indexOf("Datum");

    if (idxMonteur === -1) {
      resultBox.innerHTML =
        "<h3 style='color:red'>Fehler: Spalte „Monteur / Team“ nicht gefunden!</h3>";
      return;
    }

    // Filtern
    const eintraege = rows.slice(1).filter((r) =>
      r[idxMonteur].toLowerCase().includes(name.toLowerCase())
    );

    if (eintraege.length === 0) {
      resultBox.innerHTML =
        "<p>Keine Einträge gefunden. Schreib deinen Namen genau wie im Bericht.</p>";
      return;
    }

    // Ausgabe bauen
    let html = "<h2>👷 Deine Baustellen</h2>";

    for (const r of eintraege) {
      html += `
        <div class="card">
            <h3>${r[idxProjekt] || "Unbekannt"}</h3>
            <p><b>Datum:</b> ${r[idxDatum]}</p>
            <p><b>Monteur:</b> ${r[idxMonteur]}</p>
        </div>
      `;
    }

    resultBox.innerHTML = html;
  } catch (err) {
    resultBox.innerHTML =
      "<p style='color:red'>Fehler beim Laden des Fortschritts.</p>";
    console.error(err);
  }
}
