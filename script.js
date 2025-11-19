async function sendForm() {

    const data = {
        baustelle: document.getElementById("baustelle").value,
        datum: document.getElementById("datum").value,
        monteur: document.getElementById("monteur").value,
        zeitraum: document.getElementById("zeitraum").value,
        details: document.getElementById("details").value,
        regie: document.getElementById("regie").value,
        probleme: document.getElementById("probleme").value,
        koordination: document.getElementById("koordination").value
    };

    await fetch("https://script.google.com/macros/s/AKfycb-yuPiCXLrZtnv50GTJpenSPeg3khsboHH5pJraq0g25Ch4J598RayBwRjP_f_m6Y/exec", {


        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Bericht wurde erfolgreich gesendet! 👍");
}
