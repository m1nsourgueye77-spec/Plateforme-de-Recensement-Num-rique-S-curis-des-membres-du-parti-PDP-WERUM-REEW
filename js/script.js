const STORAGE_KEY = "adhesionPDP";


function chargerDonnees() {

    const donnees =
        localStorage.getItem(STORAGE_KEY);

    if (!donnees) {
        return {};
    }

    try {

        return JSON.parse(donnees);

    } catch(error) {

        console.error(
            "Erreur localStorage :",
            error
        );

        return {};

    }

}


function sauvegarderFormulaire(form) {

    const anciennesDonnees =
        chargerDonnees();


    const nouvellesDonnees =
        {};


    const elements =
        form.querySelectorAll(
            "input, select, textarea"
        );


    elements.forEach(function(element) {

        if (!element.name) {
            return;
        }


        // Les fichiers sont traités séparément

        if (
            element.type === "file"
        ) {
            return;
        }


        nouvellesDonnees[element.name] =
            element.value;

    });


    const donneesFinales = {

        ...anciennesDonnees,

        ...nouvellesDonnees

    };


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(donneesFinales)
    );


    console.log(
        "Données sauvegardées :",
        donneesFinales
    );

}


function viderDonnees() {

    localStorage.removeItem(
        STORAGE_KEY
    );

}


function remplirFormulaire() {

    const data =
        chargerDonnees();


    const formElements =
        document.querySelectorAll(
            "input, select, textarea"
        );


    formElements.forEach(function(element) {

        if (!element.name) {
            return;
        }


        if (
            element.type === "file"
        ) {
            return;
        }


        if (
            data[element.name] !== undefined
        ) {

            element.value =
                data[element.name];

        }

    });

}




function ouvrirScanner() {

    if (!CONFIG.fonctionsProfessionnelles.scannerQR) {

        document.getElementById("messageScanner").innerHTML = `
            🔒 <strong>Fonctionnalité professionnelle</strong><br><br>

            Le scanner QR est disponible
            dans la version professionnelle.

            <br><br>

            <button
                type="button"
                onclick="demanderActivation()"
            >
                📩 Demander l'activation
            </button>
        `;

        return;
    }

    window.location.href = "scanner.html";
}



function demanderActivation() {

    const message =
        "Bonjour Mansour,\n\n" +
        "Je souhaite demander l'activation " +
        "de la version professionnelle " +
        "de la plateforme PDP Wérum Réw.";

    const telephone = "221776813749";

    window.open(
        "https://wa.me/" +
        telephone +
        "?text=" +
        encodeURIComponent(message),
        "_blank"
    );
}
