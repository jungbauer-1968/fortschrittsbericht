async function sendForm() {
    const data = {
        monteur: document.getElementById("monteur").value,
        baustelle: document.getElementById("baustelle").value,
        details: document.getElementById("details").value,
        prozent: document.getElementById("prozent").value,
        regie: document.getElementById("regie").value,
        bemerkungen: document.getElementById("bemerkungen").value
    };

    await fetch("https://script.google.com/macros/s/AKfycbwNmQr8j3CqAmDW67FZnLiA2BtedtPYfiVSC2l_9wWVuT-QJK9-RAvAqRIGC-H1D_pg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Bericht erfolgreich gesendet!");
}
