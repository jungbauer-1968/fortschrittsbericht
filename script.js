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

  await fetch(https://script.google.com/macros/s/AKfycbwjrvCX6eUmmRR7OpjuNYD61NHfZfADlwfD24Vw-5XleenhAYPGBw_8Rviybsrz1AW/exec
", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Bericht wurde erfolgreich gesendet! 👍");
}
