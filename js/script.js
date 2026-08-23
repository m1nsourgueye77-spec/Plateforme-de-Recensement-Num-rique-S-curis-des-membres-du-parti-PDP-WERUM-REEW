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
