// =================================
// Validation du formulaire
// =================================

function verifier(formulaire){

    let champs = formulaire.querySelectorAll("[required]");

    for(let champ of champs){

        if(champ.value.trim()==""){

            alert("Veuillez remplir tous les champs obligatoires.");

            champ.focus();

            return false;

        }

    }

    return true;

}