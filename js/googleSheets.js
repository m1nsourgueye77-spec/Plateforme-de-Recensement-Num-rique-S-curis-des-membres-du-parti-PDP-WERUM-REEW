const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwBJQQNzMr6P2OTFmHOJcNuF3fAjmd3-tULPyIcNaP1qjkBHZax9UD6rPCmsLlF4Mztxg/exec";


function envoyerVersGoogleSheets(data) {

    console.log("=== ENVOI GOOGLE SHEETS ===");
    console.log(data);

    const message =
        document.getElementById("message");

    const bouton =
        document.getElementById("btnValider");


    if (message) {
        message.innerHTML =
            "⏳ Connexion à Google Sheets...";
    }


    bouton.disabled = true;

    bouton.textContent =
        "⏳ Enregistrement...";


    fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)

    })

    .then(response => {

        console.log(
            "STATUS HTTP :",
            response.status
        );

        return response.text();

    })

    .then(result => {

        console.log(
            "RÉPONSE APPS SCRIPT :",
            result
        );


        let reponse;

        try {

            reponse =
                JSON.parse(result);

        } catch (error) {

            console.error(
                "Réponse non JSON :",
                result
            );

            throw new Error(
                "Google Apps Script ne retourne pas une réponse JSON."
            );

        }


        if (!reponse.success) {

            throw new Error(
                reponse.message ||
                "Erreur inconnue dans Apps Script."
            );

        }


        // ======================================
        // SUCCÈS
        // ======================================

        if (reponse.numeroAdherent) {
         data.numeroAdherent = reponse.numeroAdherent;
        }

        if (reponse.dateValidation) {
         data.dateValidation = reponse.dateValidation;
        }


        localStorage.setItem(
            "adhesionPDP",
            JSON.stringify(data)
        );


        message.innerHTML =

            "✅ <strong>Adhésion enregistrée.</strong><br>" +

            "Numéro d'adhérent : <strong>" +

            data.numeroAdherent +

            "</strong>";


        bouton.textContent =
            "✓ Adhésion enregistrée";


        bouton.disabled = true;


    })

    .catch(error => {

        console.error(
            "=== ERREUR ==="
        );

        console.error(error);


        message.innerHTML =

            "❌ Erreur lors de l'enregistrement.<br>" +

            "<small>" +
            error.message +
            "</small>";


        bouton.disabled = false;

        bouton.textContent =
            "✓ Valider mon adhésion";

    });

}
