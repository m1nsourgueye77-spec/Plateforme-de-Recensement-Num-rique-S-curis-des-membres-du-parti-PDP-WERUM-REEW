const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";

let scannerQR = null;
let traitementEnCours = false;

document.addEventListener("DOMContentLoaded", () => {

    if (typeof Html5Qrcode === "undefined") {
        afficherErreur("La bibliothèque du scanner n'est pas disponible.");
        return;
    }

    scannerQR = new Html5Qrcode("reader");

    const inputImage = document.getElementById("qrImageInput");

    if (inputImage) {
        inputImage.addEventListener("change", importerQRCode);
    }

    demarrerCamera();
});

async function demarrerCamera() {

    if (!scannerQR || traitementEnCours) return;

    try {
        await scannerQR.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            async (texteDecode) => {
                if (traitementEnCours) return;

                traitementEnCours = true;

                await arreterCamera();

                await rechercherAdherent(texteDecode);
            },
            () => {}
        );

    } catch (erreur) {
        afficherErreur(
            "Impossible d'activer la caméra. Vérifiez les autorisations."
        );
        console.error(erreur);
    }
}

async function arreterCamera() {

    if (!scannerQR) return;

    try {
        await scannerQR.stop();
    } catch (erreur) {
        console.log("Caméra déjà arrêtée.");
    }
}

async function importerQRCode(event) {

    const fichier = event.target.files[0];

    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
        afficherErreur("Veuillez sélectionner une image valide.");
        event.target.value = "";
        return;
    }

    if (traitementEnCours) return;

    if (!scannerQR) {
        afficherErreur("Le système de lecture QR Code n'est pas initialisé.");
        event.target.value = "";
        return;
    }

    traitementEnCours = true;

    afficherMessage("Lecture du QR Code importé...");

    try {

        // Arrêter la caméra si elle est active
        await arreterCamera();

        // Lire directement le QR Code dans l'image
        const resultat = await scannerQR.scanFile(fichier, false);

        console.log("QR Code détecté :", resultat);

        // Vérifier le numéro auprès de Google Sheets
        await rechercherAdherent(resultat);

    } catch (erreur) {

        console.error("Erreur importation QR :", erreur);

        afficherErreur(
            "Impossible de lire le QR Code. Vérifiez que l'image est nette et contient un QR Code."
        );

        traitementEnCours = false;

    } finally {

        // Permettre de sélectionner à nouveau le même fichier
        event.target.value = "";
    }
}

async function rechercherAdherent(numero) {

    numero = String(numero).trim();

    if (!/^PDP-2026-\d{6}$/.test(numero)) {
        afficherErreur("Ce QR Code ne contient pas un numéro PDP valide.");
        traitementEnCours = false;
        return;
    }

    afficherMessage("Vérification de l'adhérent en cours...");

    try {

        const url = GOOGLE_SCRIPT_URL +
            "?numero=" + encodeURIComponent(numero);

        const reponse = await fetch(url);

        if (!reponse.ok) {
            throw new Error("Erreur de communication avec le serveur.");
        }

        const data = await reponse.json();

        if (
            data.success === false ||
            !data.numeroAdherent ||
            data.numeroAdherent !== numero
        ) {
            afficherErreur("Numéro d'adhérent introuvable.");
            traitementEnCours = false;
            return;
        }

        afficherSucces(data);

    } catch (erreur) {

        console.error(erreur);

        afficherErreur(
            "Impossible de vérifier le QR Code. Réessayez."
        );

        traitementEnCours = false;
    }
}

function afficherSucces(data) {

    const resultat = document.getElementById("resultat");
    const informations = document.getElementById("informations");
    const titre = document.getElementById("titreResultat");

    titre.textContent = "Vérification réussie";

    resultat.className = "succes";

    informations.textContent = "";

    const numero = document.createElement("p");
    numero.textContent = "Numéro : " + data.numeroAdherent;

    const statut = document.createElement("p");
    statut.textContent = "Statut : " + data.statut;

    const date = document.createElement("p");
    date.textContent =
        "Date de validation : " + (data.dateValidation || "Non renseignée");

    informations.append(numero, statut, date);

    resultat.style.display = "block";
}

function afficherErreur(message) {

    const resultat = document.getElementById("resultat");
    const informations = document.getElementById("informations");
    const titre = document.getElementById("titreResultat");

    titre.textContent = "Vérification impossible";

    resultat.className = "erreur";

    informations.textContent = message;

    resultat.style.display = "block";
}

function afficherMessage(message) {

    const resultat = document.getElementById("resultat");
    const informations = document.getElementById("informations");
    const titre = document.getElementById("titreResultat");

    titre.textContent = "Veuillez patienter";

    resultat.className = "";

    informations.textContent = message;

    resultat.style.display = "block";
}

async function nouveauScan() {

    traitementEnCours = false;

    const resultat = document.getElementById("resultat");

    resultat.style.display = "none";

    await demarrerCamera();
}
