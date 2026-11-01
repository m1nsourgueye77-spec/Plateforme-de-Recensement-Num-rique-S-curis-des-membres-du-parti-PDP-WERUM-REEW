// =====================================================
// PDP WËRUM RÉEW
// CONNEXION GOOGLE SHEETS
// VERSION CORRIGÉE
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";


// =====================================================
// CONTRÔLE DES SOUMISSIONS
// =====================================================

let enregistrementEnCours = false;


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
    // 3. SUPPRESSION DU NUMÉRO TEMPORAIRE FRONTEND
    // -------------------------------------------------

    // Le numéro officiel doit exclusivement
    // être attribué par Google Apps Script.

    delete data.numeroAdherent;

    delete data.dateValidation;


    // Sauvegarde des données du formulaire
    // sans faux numéro d'adhérent.

    localStorage.setItem(
        "adhesionPDP",
        JSON.stringify(data)
    );


    // -------------------------------------------------
    // 4. PRÉPARATION DE LA REQUÊTE
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
        // 5. ENVOI VERS GOOGLE APPS SCRIPT
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
        // 6. LECTURE DE LA RÉPONSE
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
        // 7. VÉRIFICATION DU SUCCÈS
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
        // 8. RÉCUPÉRATION DU NUMÉRO OFFICIEL
        // -------------------------------------------------

        data.numeroAdherent =
            reponse.numeroAdherent;

        data.dateValidation =
            reponse.dateValidation || "";


        // -------------------------------------------------
        // 9. SAUVEGARDE DE L'ADHÉSION CONFIRMÉE
        // -------------------------------------------------

        localStorage.setItem(
            "adhesionPDP",
            JSON.stringify(data)
        );


        console.log(
            "ADHÉSION CONFIRMÉE :",
            data.numeroAdherent
        );


        // -------------------------------------------------
        // 10. AFFICHAGE DU SUCCÈS
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
        // 11. REDIRECTION APRÈS CONFIRMATION
        // -------------------------------------------------

        setTimeout(function() {

            window.location.href =
                "merci.html";

        }, 1200);


    } catch (error) {


        // -------------------------------------------------
        // 12. GESTION DES ERREURS
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
                "Vérifiez la base avant de réessayer.";

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


        // -------------------------------------------------
        // 13. NETTOYAGE
        // -------------------------------------------------

        clearTimeout(delai);

    }

}