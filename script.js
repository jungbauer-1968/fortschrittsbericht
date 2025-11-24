// ==== CONFIG ====
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn9sbmbzT81t1KJQalXVr1agr9E4WUXBOTKrwMWNGimD9CnbCXD2Z2WQzpDMZKl0GVQOKI8mELb3Y0/pub?output=csv";


// ==== CSV LADEN ====
async function loadCSV(url) {
    const res = await fetch(url);
    const text = await res.text();
    return parseCSV(text);
}


// ==== CSV PARSEN ====
function parseCSV(text) {
    const rows = text.split(/\r?\n/).map(r => r.split(","));
    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1).map(r => {
        const obj = {};
        r.forEach((val, i) => obj[headers[i]] = val.trim());
        return obj;
    });
    return { headers, data };
}


// ==== FLEXIBLE SPALTENSUCHE ====
function findColumn(headers, keywords) {
    keywords = keywords.map(k => k.toLowerCase());
    return headers.find(h =>
        keywords.some(kw => h.toLowerCase().includes(kw))
    );
}


// ==== START – HAUPTLOGIK ====
async function startApp() {
    const { headers, data } = await loadCSV(CSV_URL);

    // ---- richtige Monteur-Spalte finden ----
    const monteurColumn = findColumn(headers, ["monteur", "team", "monteur / team"]);

    if (!monteurColumn) {
        document.getElementById("output").innerHTML =
            "<h2>❌ Fehler: Spalte 'Monteur / Team' nicht gefunden!</h2>";
        return;
    }

    // ---- Nachname aus URL holen ----
    const urlParams = new URLSearchParams(window.location.search);
    const name = (urlParams.get("name") || "").trim().toLowerCase();

    if (!name) {
        document.getElementById("output").innerHTML = "<h3>Kein Name angegeben.</h3>";
        return;
    }

    // ---- Datensätze filtern ----
    const entries = data.filter(r =>
        r[monteurColumn] && r[monteurColumn].trim().toLowerCase() === name
    );

    // ---- Ausgabe ----
    if (entries.length === 0) {
        document.getElementById("output").innerHTML =
            "<h3>Keine Einträge gefunden. Schreib deinen Namen GENAU wie im Formular.</h3>";
        return;
    }

    // ==== KARTEN BAUEN ====
    let html = `<h2>🔧 Deine Baustellen</h2>`;

    entries.forEach(e => {
        html += `
            <div class="entry-card">
                <h3>${e["Projekt/ Baustelle"] || "Unbekannt"}</h3>
                <p><b>Datum:</b> ${e["Datum"] || "-"}</p>
                <p><b>Woche:</b> ${e["Woche / Zeitraum"] || "-"}</p>
                <hr>
                <p><b>Fortschritt:</b></p>
                <p>${Object.entries(e).map(([k, v]) => {
                    if (k.includes("%")) return `${k}: <b>${v}</b>`;
                    return "";
                }).join("<br>")}</p>
            </div>
        `;
    });

    document.getElementById("output").innerHTML = html;
}


// ==== LOS GEHT'S ====
startApp();
