async function sendForm() {

    const data = {
        baustelle: document.getElementById("baustelle").value,
        datum: document.getElementById("datum").value,
        monteur: document.getElementById("monteur").value,
        zeitraum: document.getElementById("zeitraum").value,
        details: document.getElementById("details").value,
        regie: document.getElementById("regie").value,
        probleme: document.getElementById("probleme").value,
        koordination: document.getElementById("koordination").value,
        unterschrift: document.getElementById("unterschrift").value
    };

    await fetch("https://script.google.com/macros/s/AKfycbzqMHKmHS4gYQB_3CWGA3TH6nj7jqy58CCNZiVIIW-NjTqCh1XfbGVKMUddH3yPo6ak/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Bericht wurde erfolgreich gesendet! 👍");
}
