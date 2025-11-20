const SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn9sbmbzT81t1KJQalXVr1agr9E4WUXBOTKrwMWNGimD9CnbCXD2Z2WQzpDMZKl0GVQOKI8mELb3Y0/pub?output=csv";

async function loadData() {
    const res = await fetch(SHEET);
    const text = await res.text();

    const rows = text.split(/\r?\n/).map(r => r.split(",")).filter(r => r.length > 2);
    const headers = rows[0];
    const data = rows.slice(1);

    const monteurIndex = headers.findIndex(h => h.toLowerCase().includes("monteur"));

    const filter = document.getElementById("monteurFilter");
    const cards = document.getElementById("cards");

    // Monteure sammeln
    const liste = new Set();
    data.forEach(r => r[monteurIndex] && liste.add(r[monteurIndex]));

    filter.innerHTML = `<option value="">Alle</option>`;
    [...liste].sort().forEach(n => {
        filter.innerHTML += `<option>${n}</option>`;
    });

    function render() {
        cards.innerHTML = "";
        const chosen = filter.value;

        data.forEach(row => {
            if (chosen && row[monteurIndex] !== chosen) return;

            const projekt = row[headers.indexOf("Projekt / Baustelle")] || "Unbekannt";
            const datum = row[headers.indexOf("Datum")] || "";
            const monteur = row[monteurIndex] || "";

            const pIndex = headers.findIndex(h => h.includes("(%)"));
            let progress = row[pIndex] || "0";
            progress = progress.replace("%","");

            const div = document.createElement("div");
            div.className = "card";

            div.innerHTML = `
                <div class="cardTitle">${projekt}</div>
                <div class="cardSub">${datum} – ${monteur}</div>

                <div class="progressBar">
                    <div class="progressFill" style="width:${progress}%"></div>
                </div>

                <p><strong>${progress}%</strong> abgeschlossen</p>
            `;

            cards.appendChild(div);
        });
    }

    filter.addEventListener("change", render);
    render();
}

loadData();
