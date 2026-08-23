function exporterPDF() {

    const data = chargerDonnees();

    if (!data) {
        alert("Aucune donnée d'adhésion disponible.");
        return;
    }

    if (!window.jspdf) {
        alert("La bibliothèque PDF n'est pas chargée.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    // ==============================
    // TITRE
    // ==============================

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
        "ADHÉSION PDP WÉRUM RÉW",
        105,
        y,
        { align: "center" }
    );

    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    doc.text(
        "Récapitulatif de l'adhésion",
        105,
        y,
        { align: "center" }
    );

    y += 15;


    // ==============================
    // INFORMATIONS
    // ==============================

    const lignes = [

        ["Numéro adhérent", data.numeroAdherent],

        ["Date de validation",
            data.dateValidation
                ? new Date(data.dateValidation)
                    .toLocaleString("fr-FR")
                : ""
        ],

        ["Prénom et Nom", data.nom],

        ["Date de naissance", data.naissance],

        ["Sexe", data.sexe],

        ["Téléphone", data.telephone],

        ["Adresse / Quartier",
            data.quartier || data.adresse
        ],

        ["Profession", data.profession],

        ["Numéro de CNI", data.cni],

        ["Numéro de Non Votant", data.nonvotant],

        ["Numéro Carte Électeur", data.electeur],

        ["Région", data.region],

        ["Département", data.departement],

        ["Commune", data.commune],

        ["Centre de vote", data.centre],

        ["Bureau de vote N°", data.bureau],

        ["Cellule", data.cellule],

        ["Fonction dans le parti", data.fonction],

        [
            "Poste de responsabilité",
            data.poste_responsabilite
        ],

        ["Date d'adhésion", data.adhesion],

        ["Collecteur", data.nomcollecteur],

        ["Contact collecteur",
            data.contactcollecteur
        ]

    ];


    // ==============================
    // AFFICHAGE
    // ==============================

    doc.setFontSize(10);

    lignes.forEach(([label, valeur]) => {

        if (y > 275) {

            doc.addPage();

            y = 20;
        }

        doc.setFont("helvetica", "bold");

        doc.text(
            `${label} :`,
            20,
            y
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            String(valeur || "Non renseigné"),
            80,
            y
        );

        y += 8;

    });


    // ==============================
    // CERTIFICATION
    // ==============================

    y += 8;

    doc.setFont("helvetica", "bold");

    doc.text(
        "Certification",
        20,
        y
    );

    y += 8;

    doc.setFont("helvetica", "normal");

    doc.text(
        "Je certifie que toutes les informations",
        20,
        y
    );

    y += 6;

    doc.text(
        "fournies sont exactes et j'accepte les",
        20,
        y
    );

    y += 6;

    doc.text(
        "conditions d'adhésion.",
        20,
        y
    );


    // ==============================
    // TÉLÉCHARGEMENT
    // ==============================

    const numero =
        data.numeroAdherent || "PDP";

    doc.save(
        `Adhesion_${numero}.pdf`
    );

}
