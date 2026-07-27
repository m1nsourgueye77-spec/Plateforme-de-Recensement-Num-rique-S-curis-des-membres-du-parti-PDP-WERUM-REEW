  // ======================================
// Gi.Code
// PDP Wérum Réw
// script.js
// ======================================

// Nom de la clé utilisée dans le navigateur
const STORAGE_KEY = "adhesionPDP";

// Charger les données
function chargerDonnees() {

    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : {};

}

// Sauvegarder les données
function sauvegarderDonnees(nouvellesDonnees) {

    const anciennesDonnees = chargerDonnees();

    const donnees = {
        ...anciennesDonnees,
        ...nouvellesDonnees
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(donnees)
    );

}

// Lire une valeur
function lireValeur(cle) {

    const data = chargerDonnees();

    return data[cle] || "";

}

// Effacer toutes les données
function viderDonnees() {

    localStorage.removeItem(STORAGE_KEY);

     alert("Les données précédentes ont été supprimées.");

}

// Remplir automatiquement les champs d'un formulaire
function remplirFormulaire() {

    const data = chargerDonnees();

    document.querySelectorAll("[name]").forEach(champ => {

        if(data[champ.name] !== undefined){

            champ.value = data[champ.name];

        }

    });

}

// Sauvegarder automatiquement un formulaire
function sauvegarderFormulaire(form){

    const data = chargerDonnees();

    form.querySelectorAll("[name]").forEach(champ => {

        if(champ.type === "file"){
            return;
        }

        data[champ.name] = champ.value;

    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}



// ================================
// Validation finale
// ================================

function validerAdhesion(){

    const data = chargerDonnees();

    console.log(data);

    alert("Toutes les informations sont prêtes à être envoyées.");


    envoyerVersGoogleSheets(data);


}



function nouvelleAdhesion(){

    localStorage.removeItem("adhesionPDP");

    window.location="etape1.html";

}