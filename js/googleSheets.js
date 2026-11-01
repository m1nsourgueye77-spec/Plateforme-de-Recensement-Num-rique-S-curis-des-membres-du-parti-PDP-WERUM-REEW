// =====================================================
// PDP WËRUM RÉW
// CONNEXION GOOGLE SHEETS
// VERSION AVEC PROTECTION D'IDEMPOTENCE
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";


// =====================================================
// CONTRÔLE DES SOUMISSIONS
// =====================================================

let enregistrementEnCours = false;


// =====================================================
// GÉNÉRATION D'UNE CLÉ UNIQUE
// =====================================================

function genererCleIdempotence() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {

        return window.crypto.randomUUID();

    }

    // Solution de secours pour les navigateurs
    // ne disposant pas de randomUUID.

    return "pdp-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 15) +
        "-" +
        Math.random().toString(36).substring(2, 15);

}


// =====================================================
// ENREGISTREMENT D'UNE ADHÉSION
// =====================================================

async function envoyerVersGoogleSheets(data) {

    console.log("=== ENVOI GOOGLE SHEETS ===");
    console.log(data);

    const message =
        document.getElementById("message");

    const bouton =
        document.getElementById("btnValider");


    // -------------------------------------------------
    // 1. CONTRÔLE DES ÉLÉMENTS
    // -------------------------------------------------

    if (!message || !bouton) {

        console.error(
            "Éléments HTML message ou btnValider introuvables."
        );

        return;

    }


    // -------------------------------------------------
    // 2. EMPÊCHER LES SOUMISSIONS MULTIPLES
    // -------------------------------------------------

    if (enregistrementEnCours) {
        return;
    }

    enregistrementEnCours = true;

    bouton.disabled = true;

    bouton.textContent =
        "⏳ Enregistrement en cours...";

    message.textContent =
        "Connexion à la base officielle des adhérents...";


    // -------------------------------------------------
    // 3. SUPPRESSION DES ANCIENS NUMÉROS TEMPORAIRES
    // -------------------------------------------------

    delete data.numeroAdherent;
    delete data.dateValidation;


    // -------------------------------------------------
    // 4. CRÉATION OU RÉUTILISATION DE LA CLÉ
    // -------------------------------------------------

    // Si une clé existe déjà, on la conserve.
    // Cela permet de réessayer sans créer
    // une nouvelle transaction.

    if (
        !data.idempotencyKey ||
        !/^[a-zA-Z0-9-]{20,80}$/.test(
            String(data.idempotencyKey)
        )
    ) {

        data.idempotencyKey =
            genererCleIdempotence();

    }


    console.log(
        "CLÉ DE TRANSACTION :",
        data.idempotencyKey
    );


    // -------------------------------------------------
    // 5. SAUVEGARDE AVANT L'ENVOI
    // -------------------------------------------------

    // Très important :
    // la clé doit être conservée même si
    // la connexion Internet échoue.

    try {

        localStorage.setItem(
            "adhesionPDP",
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            "Erreur sauvegarde locale :",
            error
        );

        message.textContent =
            "Impossible de sauvegarder les données localement.";

        bouton.disabled = false;

        bouton.textContent =
            "Réessayer l'enregistrement";

        enregistrementEnCours = false;

        return;

    }


    // -------------------------------------------------
    // 6. PRÉPARATION DE LA REQUÊTE
    // -------------------------------------------------

    const controleur =
        new AbortController();

    const delai =
        setTimeout(
            () => controleur.abort(),
            45000
        );


    try {


        // -------------------------------------------------
        // 7. ENVOI VERS GOOGLE APPS SCRIPT
        // -------------------------------------------------

        const response = await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body: JSON.stringify(data),

                signal: controleur.signal

            }
        );


        console.log(
            "STATUS HTTP :",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " + response.status
            );

        }


        // -------------------------------------------------
        // 8. LECTURE DE LA RÉPONSE
        // -------------------------------------------------

        const resultat =
            await response.text();

        console.log(
            "RÉPONSE APPS SCRIPT :",
            resultat
        );


        let reponse;

        try {

            reponse = JSON.parse(resultat);

        } catch (error) {

            throw new Error(
                "Réponse Google Apps Script invalide."
            );

        }


        // -------------------------------------------------
        // 9. VÉRIFICATION DU SUCCÈS
        // -------------------------------------------------

        if (!reponse.success) {

            throw new Error(
                reponse.message ||
                "Échec de l'enregistrement."
            );

        }


        if (!reponse.numeroAdherent) {

            throw new Error(
                "Aucun numéro officiel reçu de Google Sheets."
            );

        }


        // -------------------------------------------------
        // 10. RÉCUPÉRATION DU NUMÉRO OFFICIEL
        // -------------------------------------------------

        data.numeroAdherent =
            reponse.numeroAdherent;

        data.dateValidation =
            reponse.dateValidation || "";


        // -------------------------------------------------
        // 11. SAUVEGARDE DE L'ADHÉSION CONFIRMÉE
        // -------------------------------------------------

        localStorage.setItem(
            "adhesionPDP",
            JSON.stringify(data)
        );


        console.log(
            "ADHÉSION CONFIRMÉE :",
            data.numeroAdherent
        );

        console.log(
            "TRANSACTION DÉJÀ ENREGISTRÉE :",
            reponse.dejaEnregistre === true
        );


        // -------------------------------------------------
        // 12. AFFICHAGE DU SUCCÈS
        // -------------------------------------------------

        message.textContent = "";

        const confirmation =
            document.createElement("strong");

        confirmation.textContent =
            "✓ Adhésion enregistrée avec succès.";

        const saut =
            document.createElement("br");

        const numero =
            document.createElement("strong");

        numero.textContent =
            data.numeroAdherent;

        message.appendChild(confirmation);

        message.appendChild(saut);

        message.appendChild(
            document.createTextNode(
                "Numéro officiel d'adhérent : "
            )
        );

        message.appendChild(numero);


        bouton.textContent =
            "✓ Adhésion enregistrée";


        // -------------------------------------------------
        // 13. REDIRECTION
        // -------------------------------------------------

        setTimeout(function() {

            window.location.href =
                "merci.html";

        }, 1200);


    } catch (error) {


        // -------------------------------------------------
        // 14. GESTION DES ERREURS
        // -------------------------------------------------

        console.error(
            "=== ERREUR GOOGLE SHEETS ===",
            error
        );


        let messageErreur =
            error.message;


        if (error.name === "AbortError") {

            messageErreur =
                "Le délai de connexion a été dépassé. " +
                "Votre clé de transaction est conservée. " +
                "Vous pouvez réessayer sans créer volontairement une nouvelle transaction.";

        }


        message.textContent = "";


        const erreur =
            document.createElement("strong");

        erreur.textContent =
            "✗ Échec de l'enregistrement.";

        const detail =
            document.createElement("small");

        detail.textContent =
            messageErreur;


        message.appendChild(erreur);

        message.appendChild(
            document.createElement("br")
        );

        message.appendChild(detail);


        bouton.disabled = false;

        bouton.textContent =
            "Réessayer l'enregistrement";


        enregistrementEnCours = false;


    } finally {

        clearTimeout(delai);

    }

}
