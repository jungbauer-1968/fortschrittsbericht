const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ayC-9NWv1k4jFUtnxDQ5P8tenYfVsI5IOIp6lffPP0w/export?format=csv&gid=1954522343";

const monteurSelect = document.getElementById("monteurSelect");
const reportList = document.getElementById("reportList");
const statusEl = document.getElementById("status");

monteurSelect.addEventListener("change", loadReports);

async function loadReports() {
  const monteur = getSelectedMonteur();

  reportList.innerHTML = "";
  statusEl.textContent = "Lade Berichte …";

  if (!monteur) {
    statusEl.textContent = "Bitte Monteur wählen…";
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = parseCSV(text);

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const monteurIndex = headers.indexOf("Monteur / Team");
    const projektIndex = headers.indexOf("Projekt / Baustelle");
    const datumIndex = headers.indexOf("Datum");
    const wocheIndex = headers.indexOf("Woche / Zeitraum");

    // Prozent-Spalten
    const percentColumns = headers
      .map((h, i) => ({ h, i }))
      .filter(col => col.h.includes("%"));

    const filtered = dataRows.filter(
      r => r[monteurIndex]?.trim() === monteur
    );

    statusEl.textContent = `${filtered.length} Meldung(en) gefunden`;

    if (filtered.length === 0) {
      reportList.innerHTML = "<em>Keine Meldungen gefunden.</em>";
      return;
    }

    filtered.reverse().forEach(row => {
      const div = document.createElement("div");
      div.className = "report-item";

      let percentHtml = "";
      percentColumns.forEach(col => {
        if (row[col.i]) {
          percentHtml += `<div>${col.h}: <b>${row[col.i]}</b></div>`;
        }
      });

      div.innerHTML = `
        <b>${row[projektIndex]}</b><br>
        Datum: ${row[datumIndex]}<br>
        Woche: ${row[wocheIndex]}<br>
        <div class="percents">${percentHtml}</div>
      `;

      reportList.appendChild(div);
    });
  } catch (e) {
    statusEl.textContent = "Fehler beim Laden der Berichte";
    console.error(e);
  }
}

function getSelectedMonteur() {
  if (monteurSelect.value === "_other") {
    return document.getElementById("otherMonteur")?.value.trim();
  }
  return monteurSelect.value;
}

function parseCSV(text) {
  return text
    .split("\n")
    .map(r => r.split(",").map(c => c.replace(/^"|"$/g, "")));
}
