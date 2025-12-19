const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ayC-9NWv1k4jFUtnxDQ5P8tenYfVsI5IOIp6lffPP0w/export?format=csv&gid=1954522343";

const monteurSelect = document.getElementById("monteurSelect");
const reportList = document.getElementById("reportList");
const statusEl = document.getElementById("status");

monteurSelect.addEventListener("change", loadReports);

async function loadReports() {
  const monteur =
    monteurSelect.value === "_other"
      ? document.getElementById("otherMonteur").value.trim()
      : monteurSelect.value;

  if (!monteur) {
    statusEl.textContent = "Bitte Monteur wählen…";
    reportList.innerHTML = "";
    return;
  }

  statusEl.textContent = "Lade Berichte…";
  reportList.innerHTML = "";

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1); // Header weg
    const matches = rows
      .map(r => r.split(","))
      .filter(r => r[3]?.trim() === monteur);

    statusEl.textContent = `${matches.length} Meldung(en) gefunden`;

    matches.reverse().forEach(r => {
      const card = document.createElement("div");
      card.className = "report-card";

      card.innerHTML = `
        <strong>${r[1]}</strong><br>
        Datum: ${r[2]}<br>
        Woche: ${r[4]}<br><br>

        <u>Leistungsfortschritt:</u><br>
        Baustelleneinrichtung: ${r[8] || "-"}<br>
        Zuleitung & Zählerplätze: ${r[9] || "-"}<br>
        Rohr- & Tragsysteme: ${r[10] || "-"}<br>
        Kabel & Leitungen: ${r[11] || "-"}<br>
      `;

      reportList.appendChild(card);
    });
  } catch (e) {
    statusEl.textContent = "Fehler beim Laden der Berichte";
    console.error(e);
  }
}
