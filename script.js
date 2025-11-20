// Google-Sheet-CSV-Link
const SHEET =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn9sbmbzT81t1KJQalXVr1agr9E4WUXBOTKrwMWNGimD9CnbCXD2Z2WQzpDMZKl0GVQOKI8mELb3Y0/pub?output=csv";

async function loadData() {
  const res = await fetch(SHEET);
  const text = await res.text();

  const rows = text
    .split(/\r?\n/)
    .map((r) => r.split(","))
    .filter((r) => r.length > 1);

  if (rows.length <= 1) {
    document.getElementById("noDataMsg").style.display = "block";
    return;
  }

  const headers = rows[0];
  const data = rows.slice(1);

  const monteurIndex = headers.findIndex((h) =>
    h.toLowerCase().includes("monteur")
  );
  const projektIndex = headers.findIndex((h) =>
    h.toLowerCase().includes("projekt")
  );
  const datumIndex = headers.findIndex((h) =>
    h.toLowerCase().includes("datum")
  );
  const zeitIndex = headers.findIndex((h) =>
    h.toLowerCase().includes("zeitstempel")
  );

  // alle Spalten, die Prozentwerte sind
  const percentIndexes = headers
    .map((h, idx) => (h.includes("(%)") ? idx : -1))
    .filter((idx) => idx >= 0);

  const filter = document.getElementById("monteurFilter");
  const cardsContainer = document.getElementById("cards");
  const noDataMsg = document.getElementById("noDataMsg");

  // Monteure einsammeln
  const monteure = new Set();
  data.forEach((row) => {
    if (monteurIndex >= 0 && row[monteurIndex]) {
      monteure.add(row[monteurIndex]);
    }
  });

  filter.innerHTML = '<option value="">Alle</option>';
  [...monteure]
    .sort()
    .forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      filter.appendChild(opt);
    });

  function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace("%", "").replace(",", ".")) || 0;
  }

  function renderCards() {
    cardsContainer.innerHTML = "";
    let count = 0;
    const filterVal = filter.value;

    data.forEach((row) => {
      // leere Zeilen überspringen
      if (!row.some((v) => v && v.trim() !== "")) return;

      if (filterVal && monteurIndex >= 0 && row[monteurIndex] !== filterVal)
        return;

      const projekt =
        (projektIndex >= 0 && row[projektIndex]) || "Unbekannt";
      const datum =
        (datumIndex >= 0 && row[datumIndex]) ||
        (zeitIndex >= 0 ? row[zeitIndex] : "");
      const monteur =
        (monteurIndex >= 0 && row[monteurIndex]) || "";

      // Fortschritt (Durchschnitt aller %-Felder)
      let progress = 0;
      if (percentIndexes.length > 0) {
        const vals = percentIndexes.map((idx) => parseNumber(row[idx]));
        const sum = vals.reduce((a, b) => a + b, 0);
        progress = Math.round(sum / percentIndexes.length);
      }

      const card = document.createElement("article");
      card.className = "card";

      // Header
      const headerDiv = document.createElement("div");
      headerDiv.className = "cardHeader";

      const titleBlock = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "cardTitle";
      titleEl.textContent = projekt;

      const subEl = document.createElement("div");
      subEl.className = "cardSub";
      subEl.textContent = `${datum} – ${monteur}`;

      titleBlock.appendChild(titleEl);
      titleBlock.appendChild(subEl);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toggleBtn";
      btn.textContent = "Details anzeigen";

      headerDiv.appendChild(titleBlock);
      headerDiv.appendChild(btn);
      card.appendChild(headerDiv);

      // Fortschritt
      const progSection = document.createElement("div");
      progSection.className = "progressSection";

      const label = document.createElement("div");
      label.className = "progressLabel";
      label.textContent = `${progress} % abgeschlossen`;

      const bar = document.createElement("div");
      bar.className = "progressBar";

      const fill = document.createElement("div");
      fill.className = "progressFill";
      fill.style.width = `${Math.max(0, Math.min(progress, 100))}%`;

      bar.appendChild(fill);
      progSection.appendChild(label);
      progSection.appendChild(bar);
      card.appendChild(progSection);

      // Details (alle anderen Felder)
      const details = document.createElement("div");
      details.className = "details";

      headers.forEach((h, idx) => {
        const value = row[idx];
        if (!value || value.trim() === "") return;

        // diese Felder im Header brauchen wir nicht doppelt
        if (
          idx === projektIndex ||
          idx === datumIndex ||
          idx === monteurIndex ||
          idx === zeitIndex
        ) {
          return;
        }

        const rowDiv = document.createElement("div");
        rowDiv.className = "detail-row";

        const keySpan = document.createElement("span");
        keySpan.className = "detail-key";
        keySpan.textContent = h;

        const valSpan = document.createElement("span");
        valSpan.className = "detail-value";
        valSpan.textContent = value;

        rowDiv.appendChild(keySpan);
        rowDiv.appendChild(valSpan);
        details.appendChild(rowDiv);
      });

      card.appendChild(details);

      // Toggle-Logik
      btn.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        btn.textContent = open ? "Details ausblenden" : "Details anzeigen";
      });

      cardsContainer.appendChild(card);
      count++;
    });

    noDataMsg.style.display = count === 0 ? "block" : "none";
  }

  filter.addEventListener("change", renderCards);
  renderCards();
}

loadData().catch((err) => {
  console.error(err);
  document.getElementById("noDataMsg").textContent =
    "Fehler beim Laden der Daten.";
  document.getElementById("noDataMsg").style.display = "block";
});
