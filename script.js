const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ayC-9NWv1k4jFUtnxDQ5P8tenYfVsI5IOIp6lffPP0w/export?format=csv&gid=1954522343";

const monteurSelect = document.getElementById("monteurSelect");
const reportList = document.getElementById("reportList");
const statusEl = document.getElementById("status");

monteurSelect.addEventListener("change", loadReports);

async function loadReports() {
  const monteur = monteurSelect.value;
  reportList.innerHTML = "";

  if (!monteur) {
    statusEl.textContent = "Bitte Monteur wählen…";
    return;
  }

  statusEl.textContent = "Lade Meldungen…";

  const res = await fetch(SHEET_CSV_URL);
  const text = await res.text();
  const rows = text.split("\n").slice(1).map(r => r.split(","));

  const filtered = rows.filter(r => r[3]?.trim() === monteur);

  statusEl.textContent = `${filtered.length} Meldung(en) gefunden`;

  filtered.reverse().forEach(r => {
    const card = document.createElement("div");
    card.className = "report-card";

    card.innerHTML = `
      <h3>${r[1]}</h3>
      <p><strong>Datum:</strong> ${r[2]}</p>
      <p><strong>Woche:</strong> ${r[4]}</p>

      <details>
        <summary>Leistungsfortschritt</summary>
        <ul>
          <li>Baustelleneinrichtung: ${r[8]}</li>
          <li>Zuleitung & Zählerplätze: ${r[9]}</li>
          <li>Rohr- & Tragsysteme: ${r[10]}</li>
          <li>Kabel & Leitungen: ${r[11]}</li>
          <li>Schalt- & Steckgeräte: ${r[12]}</li>
        </ul>
      </details>

      ${r[20] ? `<a href="${r[20]}" target="_blank">📷 Fotos ansehen</a>` : ""}
    `;

    reportList.appendChild(card);
  });
}
