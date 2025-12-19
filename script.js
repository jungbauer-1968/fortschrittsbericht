// 🔗 CSV-Link deines Google-Sheets (Formularantworten 1)
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ayC-9NWv1k4jFUtnxDQ5P8tenYfVsI5IOIp6lffPP0w/export?format=csv&gid=1954522343";

const monteurSelect = document.getElementById("monteurSelect");
const reportList = document.getElementById("reportList");
const statusEl = document.getElementById("status");
const openFormBtn = document.getElementById("openFormBtn");

// 🔗 Google Formular
openFormBtn.onclick = () => {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSecipezzn5hUo3X_0378a5JCM0eV-a278T_caoqbbkTKphjJg/viewform",
    "_blank"
  );
};

monteurSelect.addEventListener("change", loadReports);

async function loadReports() {
  const monteur = getSelectedMonteur();
  reportList.innerHTML = "";
  statusEl.textContent = "Lade Meldungen …";

  if (!monteur) {
    statusEl.textContent = "Bitte Monteur wählen…";
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = parseCSV(text);

    const header = rows[0];
    const data = rows.slice(1);

    const monteurIndex = header.indexOf("Monteur / Team");

    const results = data.filter(
      (r) => r[monteurIndex]?.trim() === monteur
    );

    statusEl.textContent = `${results.length} Meldung(en) gefunden`;

    results.forEach((row) => {
      const card = document.createElement("div");
      card.className = "report-card";

      const projekt = row[1];
      const datum = row[2];
      const woche = row[4];

      let html = `
        <strong>${projekt}</strong><br>
        Datum: ${datum}<br>
        Woche: ${woche}<br>
      `;

      // 🔢 Prozentfelder (ab Spalte I)
      html += `<div class="percent-block"><strong>Leistungsfortschritt:</strong><br>`;
      for (let i = 8; i < row.length; i++) {
        if (header[i] && row[i]) {
          html += `${header[i]}: ${row[i]}<br>`;
        }
      }
      html += `</div>`;

      // 📸 Foto-Links erkennen
      html += `<div class="photo-block"><strong>Fotos:</strong><br>`;
      row.forEach((cell) => {
        if (cell && cell.startsWith("http")) {
          html += `<a href="${cell}" target="_blank">📷 Foto öffnen</a><br>`;
        }
      });
      html += `</div>`;

      card.innerHTML = html;
      reportList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Fehler beim Laden der Berichte";
  }
}

// 👤 Monteur aus Dropdown / Freitext
function getSelectedMonteur() {
  const val = monteurSelect.value;
  if (val === "_other") {
    return document.getElementById("otherMonteur").value.trim();
  }
  return val;
}

// 🧠 CSV Parser
function parseCSV(text) {
  return text
    .split("\n")
    .map((row) =>
      row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.replace(/^"|"$/g, "").trim())
    );
}
