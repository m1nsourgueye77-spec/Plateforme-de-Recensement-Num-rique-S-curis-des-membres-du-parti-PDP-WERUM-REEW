function genererQRCode(numero) {

    const zone = document.getElementById("qrcode");

    if (!zone) {
        console.error("Zone QR Code introuvable.");
        return;
    }

    zone.innerHTML = "";

    // Vérification du numéro officiel
    if (!numero || !/^PDP-2026-\d{6}$/.test(numero)) {
        console.error("Numéro d'adhérent invalide :", numero);
        zone.textContent = "QR Code indisponible";
        return;
    }

    // Vérification de la bibliothèque
    if (typeof QRCode === "undefined") {
        console.error("Bibliothèque QRCode non chargée.");
        zone.textContent = "Bibliothèque QR Code indisponible";
        return;
    }

    // Génération du QR Code
    new QRCode(zone, {
        text: numero,
        width: 180,
        height: 180,
        correctLevel: QRCode.CorrectLevel.H
    });

    console.log("QR Code généré pour :", numero);
}
