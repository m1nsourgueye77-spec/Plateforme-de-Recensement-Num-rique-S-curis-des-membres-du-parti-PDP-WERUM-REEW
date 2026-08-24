// ==========================================
// URL GOOGLE APPS SCRIPT
// ==========================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";


// ==========================================
// VARIABLES
// ==========================================

let scanner = null;

let scanEnCours = false;


// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        demarrerScanner();

    }
);


// ==========================================
// DÉMARRER LE SCANNER
// ==========================================

function demarrerScanner() {

    scanner =
        new Html5Qrcode(
            "reader"
        );


    const configuration = {

        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        }

    };


    scanner.start(

        {
            facingMode: "environment"
        },

        configuration,

        qrCodeMessage => {

            if (scanEnCours) {
                return;
            }


            scanEnCours = true;


            console.log(
                "QR Code détecté :",
                qrCodeMessage
            );


            rechercherAdherent(
                qrCodeMessage
            );


            scanner.stop().catch(
                error => {
                    console.log(
                        "Arrêt scanner :",
                        error
                    );
                }
            );

        },

        errorMessage => {

            // Les erreurs de scan
            // sont normales pendant
            // la recherche du QR.

        }

    ).catch(error => {

        console.error(
            "Erreur caméra :",
            error
        );


        afficherErreur(
            "Impossible d'accéder à la caméra. " +
            "Vérifiez l'autorisation de la caméra."
        );

    });

}


// ==========================================
// RECHERCHE ADHÉRENT
// ==========================================

function rechercherAdherent(
    numero
) {

    afficherChargement();


    const url =
        GOOGLE_SCRIPT_URL +
        "?numero=" +
        encodeURIComponent(numero);


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Erreur HTTP : " +
                    response.status
                );

            }


            return response.json();

        })

        .then(data => {

            console.log(
                "Réponse Google Apps Script :",
                data
            );


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Adhérent introuvable."
                );

            }


            afficherAdherent(
                data.adherent
            );

        })

        .catch(error => {

            console.error(
                "Erreur recherche :",
                error
            );


            afficherErreur(
                error.message ||
                "Adhérent introuvable."
            );


            // Permettre un nouveau scan

            setTimeout(
                function () {

                    scanEnCours = false;

                    demarrerScanner();

                },
                3000
            );

        });

}


// ==========================================
// AFFICHER CHARGEMENT
// ==========================================

function afficherChargement() {

    const resultat =
        document.getElementById(
            "resultat"
        );

    const titre =
        document.getElementById(
            "titreResultat"
        );

    const informations =
        document.getElementById(
            "informations"
        );


    resultat.style.display =
        "block";

    resultat.className =
        "";


    titre.textContent =
        "⏳ Recherche en cours...";


    informations.innerHTML =
        "Recherche de l'adhérent dans la base de données...";

}


// ==========================================
// AFFICHER ADHÉRENT
// ==========================================

function afficherAdherent(
    data
) {

    const resultat =
        document.getElementById(
            "resultat"
        );

    const titre =
        document.getElementById(
            "titreResultat"
        );

    const informations =
        document.getElementById(
            "informations"
        );


    resultat.style.display =
        "block";


    resultat.className =
        "succes";


    titre.textContent =
        "✅ Adhérent trouvé";


    informations.innerHTML = `

        <p>
            <strong>Numéro adhérent :</strong>
            ${securiser(data.numeroAdherent)}
        </p>

        <p>
            <strong>Prénom et Nom :</strong>
            ${securiser(data.nom)}
        </p>

        <p>
            <strong>Téléphone :</strong>
            ${securiser(data.telephone)}
        </p>

        <p>
            <strong>Commune :</strong>
            ${securiser(data.commune)}
        </p>

        <p>
            <strong>Département :</strong>
            ${securiser(data.departement)}
        </p>

        <p>
            <strong>Région :</strong>
            ${securiser(data.region)}
        </p>

        <p>
            <strong>Fonction :</strong>
            ${securiser(data.fonction)}
        </p>

        <p>
            <strong>Date d'adhésion :</strong>
            ${securiser(data.adhesion)}
        </p>

        <p>
            <strong>Date de validation :</strong>
            ${securiser(data.dateValidation)}
        </p>

    `;

}


// ==========================================
// ERREUR
// ==========================================

function afficherErreur(
    message
) {

    const resultat =
        document.getElementById(
            "resultat"
        );

    const titre =
        document.getElementById(
            "titreResultat"
        );

    const informations =
        document.getElementById(
            "informations"
        );


    resultat.style.display =
        "block";


    resultat.className =
        "erreur";


    titre.textContent =
        "❌ Adhérent introuvable";


    informations.textContent =
        message;

}


// ==========================================
// SÉCURISATION AFFICHAGE
// ==========================================

function securiser(
    valeur
) {

    if (
        valeur === null ||
        valeur === undefined ||
        valeur === ""
    ) {

        return "Non renseigné";

    }


    return String(valeur)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}