const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";

let scannerQR = null;
let traitementEnCours = false;
let cameraActive = false;
let demarrageEnCours = false;

const appareilMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);


// ==========================================
// INITIALISATION
// ==========================================

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


// ==========================================
// SÉLECTION AUTOMATIQUE DE LA CAMÉRA
// ==========================================

async function selectionnerCamera() {

    const cameras = await Html5Qrcode.getCameras();

    if (!cameras || cameras.length === 0) {
        throw new Error("Aucune caméra détectée.");
    }

    console.log("Caméras disponibles :", cameras);

    let cameraChoisie = null;

    if (appareilMobile) {

        // Sur téléphone : privilégier la caméra arrière.

        cameraChoisie = cameras.find(camera =>
            /back|rear|environment|arrière|traseira/i.test(camera.label)
        );

        // Si aucune caméra arrière n'est identifiable,
        // utiliser la première caméra disponible.

        if (!cameraChoisie) {
            cameraChoisie = cameras[0];
        }

    } else {

        // Sur ordinateur : exclure les caméras virtuelles.

        const camerasPhysiques = cameras.filter(camera =>
            !/OBS|virtual|virtuel|manycam|snap camera/i.test(camera.label)
        );

        // Privilégier la caméra HP intégrée.

        cameraChoisie =
            camerasPhysiques.find(camera =>
                /HP True Vision|integrated|built.?in/i.test(camera.label)
            ) || camerasPhysiques[0] || cameras[0];
    }

    console.log("Caméra sélectionnée :", cameraChoisie.label);

    return cameraChoisie.id;
}


// ==========================================
// DÉMARRAGE DE LA CAMÉRA
// ==========================================

async function demarrerCamera() {

    if (!scannerQR || traitementEnCours ||
        cameraActive || demarrageEnCours) {
        return;
    }

    demarrageEnCours = true;

    try {

        afficherMessage("Initialisation de la caméra...");

        const cameraId = await selectionnerCamera();

        await scannerQR.start(
            cameraId,
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

        cameraActive = true;

        console.log("Caméra démarrée avec succès.");

    } catch (erreur) {

        console.error("Erreur démarrage caméra :", erreur);

        cameraActive = false;

        afficherErreur(
            "Impossible d'activer la caméra. Vérifiez les autorisations."
        );

    } finally {

        demarrageEnCours = false;
    }
}


// ==========================================
// ARRÊT DE LA CAMÉRA
// ==========================================

async function arreterCamera() {

    if (!scannerQR || !cameraActive) return;

    try {

        await scannerQR.stop();

        cameraActive = false;

        console.log("Caméra arrêtée.");

    } catch (erreur) {

        console.error("Erreur arrêt caméra :", erreur);
    }
}


// ==========================================
// IMPORTATION D'UN QR CODE DEPUIS UNE IMAGE
// ==========================================

async function importerQRCode(event) {

    const fichier = event.target.files[0];

    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {

        afficherErreur("Veuillez sélectionner une image valide.");

        event.target.value = "";

        return;
    }

    if (traitementEnCours || demarrageEnCours) {

        afficherMessage("Veuillez patienter pendant l'initialisation du scanner.");

        event.target.value = "";

        return;
    }

    if (!scannerQR) {

        afficherErreur("Le système de lecture QR Code n'est pas initialisé.");

        event.target.value = "";

        return;
    }

    traitementEnCours = true;

    afficherMessage("Lecture du QR Code importé...");

    try {

        await arreterCamera();

        const resultat = await scannerQR.scanFile(fichier, false);

        console.log("QR Code détecté :", resultat);

        await rechercherAdherent(resultat);

    } catch (erreur) {

        console.error("Erreur importation QR :", erreur);

        afficherErreur(
            "Impossible de lire le QR Code. Vérifiez que l'image est nette et contient un QR Code."
        );

        traitementEnCours = false;

    } finally {

        event.target.value = "";
    }
}


// ==========================================
// VÉRIFICATION AUPRÈS DE GOOGLE SHEETS
// ==========================================

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

        console.error("Erreur de vérification :", erreur);

        afficherErreur(
            "Impossible de vérifier le QR Code. Réessayez."
        );

        traitementEnCours = false;
    }
}


// ==========================================
// AFFICHAGE DU RÉSULTAT POSITIF
// ==========================================

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
        "Date de validation : " +
        (data.dateValidation || "Non renseignée");

    informations.append(numero, statut, date);

    resultat.style.display = "block";
}


// ==========================================
// AFFICHAGE DES ERREURS
// ==========================================

function afficherErreur(message) {

    const resultat = document.getElementById("resultat");
    const informations = document.getElementById("informations");
    const titre = document.getElementById("titreResultat");

    titre.textContent = "Vérification impossible";

    resultat.className = "erreur";

    informations.textContent = message;

    resultat.style.display = "block";
}


// ==========================================
// AFFICHAGE DES MESSAGES
// ==========================================

function afficherMessage(message) {

    const resultat = document.getElementById("resultat");
    const informations = document.getElementById("informations");
    const titre = document.getElementById("titreResultat");

    titre.textContent = "Veuillez patienter";

    resultat.className = "";

    informations.textContent = message;

    resultat.style.display = "block";
}


// ==========================================
// NOUVEAU SCAN
// ==========================================

async function nouveauScan() {

    if (demarrageEnCours) return;

    traitementEnCours = false;

    const resultat = document.getElementById("resultat");

    resultat.style.display = "none";

    await arreterCamera();

    await demarrerCamera();
}
