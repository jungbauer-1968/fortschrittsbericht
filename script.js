async function sendForm() {

    const data = {
        baustelle: document.getElementById("baustelle").value,
        datum: document.getElementById("datum").value,
        monteur: document.getElementById("monteur").value,
        zeitraum: document.getElementById("zeitraum").value,
        berichte: document.getElementById("berichte").checked,
        fotos: document.getElementById("fotos").checked,
        besonderheiten: document.getElementById("besonderheiten").checked,
        baustelleneinrichtung: document.getElementById("baustelleneinrichtung").value,
        zuleitung: document.getElementById("zuleitung").value,
        rohr_tragsysteme: document.getElementById("rohr_tragsysteme").value,
        kabel_leitungen: document.getElementById("kabel_leitungen").value,
        schalt_steckgeraete: document.getElementById("schalt_steckgeraete").value,
        pv_anlage: document.getElementById("pv_anlage").value,
        beleuchtungskörper: document.getElementById("beleuchtungskörper").value,
        aussenbeleuchtung: document.getElementById("aussenbeleuchtung").value,
        antennenanlage: document.getElementById("antennenanlage").value,
        brandrauch: document.getElementById("brandrauch").value,
        dokumentation: document.getElementById("dokumentation").value,
        allgemeinkosten: document.getElementById("allgemeinkosten").value,
        nsp_verteilung: document.getElementById("nsp_verteilung").value,
        erdung_blitzschutz: document.getElementById("erdung_blitzschutz").value,
        kommunikation: document.getElementById("kommunikation").value,
        demontage: document.getElementById("demontage").value,
        planung: document.getElementById("planung").value,
        tiefgarage: document.getElementById("tiefgarage").value,
        rohinstallation_decke: document.getElementById("rohinstallation_decke").value,
        rohinstallation_waende: document.getElementById("rohinstallation_waende").value,
        leuchten: document.getElementById("leuchten").value,
        kabel_einziehen: document.getElementById("kabel_einziehen").value,
        sprech: document.getElementById("sprech").value,
        gegensprechanlage: document.getElementById("gegensprechanlage").value,
        wartezeiten: document.getElementById("wartezeiten").checked,
        zusatzarbeiten: document.getElementById("zusatzarbeiten").checked,
        mehrarbeit: document.getElementById("mehrarbeit").checked,
        details: document.getElementById("details").value,
        probleme: document.getElementById("probleme").value,
        koordination: document.getElementById("koordination").value,
        unterschrift: document.getElementById("unterschrift").value
    };

    await fetch(https://script.google.com/macros/s/AKfycbyMLnAxdjfP4VzEGjaYXHAqiYw8-dqTAPEqvQ5I7toYnuwJMi2ka881m_5eJ-Ua5Ih4/exec, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Bericht wurde erfolgreich gesendet! 👍");
}
