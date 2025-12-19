const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ayC-9NWv1k4jFUtnxDQ5P8tenYfVsI5IOIp6lffPP0w/export?format=csv&gid=1954522343";

const monteurSelect = document.getElementById("monteurSelect");
const reportList = document.getElementById("reportList");
const statusEl = document.getElementById("status");

monteurSelect.addEventListener("change", loadReports);

async function loadReports() {
  const selectedMonteur = getSelectedMonteur();
  reportList.innerHTML = "";

  if (!selectedMonteur) {
    statusEl.textContent = "Bitte Monteur wählen…";
    return;
  }

  statusEl.textContent = "Lade Berichte…";

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();

    const rows = text.split("\n").map(r => r.split(","));
    const dataRows = rows.slice(1); // ohne Header

    const matches = dataRows.filter(
      r => r[3]?.trim() === selectedMonteur
    );

    statusEl.textContent = `${matches.length} Meldung(en) gefunden`;

    if (matches.length === 0) return;

    matches.reverse().forEach(r => {
      const card = document.createElement("div");
      card.className = "report-card";

      card.innerHTML = `
        <strong>${r[1]}</strong><br>
        Datum: ${r[2]}<br>
        Woche: ${r[4]}<br><br>

        <u>Leistungsstand:</u><br>
        Baustelleneinrichtung: ${r[8] || "-"}<br>
        Zuleitung & Zählerplätze: ${r[9] || "-"}<br>
        Rohr- & Tragsysteme: ${r[10] || "-"}<br>
        Kabel & Leitungen: ${r[11] || "-"}
      `;

      reportList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Fehler beim Laden der Berichte";
  }
}

function getSelectedMonteur() {
  const val = monteurSelect.value;
  if (val === "_other") {
    return document.getElementById("otherMonteur").value.trim();
  }
  return val;
}
