function exporterPDF() {

    const data = chargerDonnees();

    if (!data || Object.keys(data).length === 0) {
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
    // LOGO PDP
    // ==============================

    try {

        doc.addImage(
            "images/logo-pdp.jpg",
            "JPEG",
            85,
            8,
            40,
            20
        );

        y = 35;

    } catch (error) {

        console.warn(
            "Logo PDP non chargé :",
            error
        );

        y = 20;
    }


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

        [
            "Date de validation",
            data.dateValidation
                ? new Date(data.dateValidation)
                    .toLocaleString("fr-FR")
                : ""
        ],

        ["Prénom et Nom", data.nom],

        ["Date de naissance", data.naissance],

        ["Sexe", data.sexe],

        ["Téléphone", data.telephone],

        [
            "Adresse / Quartier",
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

        [
            "Contact collecteur",
            data.contactcollecteur
        ]

    ];


    // ==============================
    // AFFICHAGE
    // ==============================

    doc.setFontSize(10);

    lignes.forEach(([label, valeur]) => {

        if (y > 270) {

            doc.addPage();

            y = 20;
        }

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            `${label} :`,
            20,
            y
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            String(
                valeur || "Non renseigné"
            ),
            80,
            y
        );

        y += 8;

    });


    // ==============================
    // CERTIFICATION
    // ==============================

    y += 8;

    // Vérifier l'espace disponible
    if (y > 235) {

        doc.addPage();

        y = 25;
    }

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "Certification",
        20,
        y
    );

    y += 8;

    doc.setFont(
        "helvetica",
        "normal"
    );

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
    // SIGNATURES
    // ==============================

    y += 20;

    // Vérifier l'espace
    if (y > 235) {

        doc.addPage();

        y = 30;
    }


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "VALIDATION OFFICIELLE",
        105,
        y,
        { align: "center" }
    );

    y += 12;


    // Ligne gauche
    doc.text(
        "Le Secrétaire Général",
        55,
        y,
        { align: "center" }
    );


    // Ligne droite
    doc.text(
        "Le Président",
        155,
        y,
        { align: "center" }
    );


    y += 8;


    // ==============================
    // SIGNATURE SG
    // ==============================

    try {

        doc.addImage(
            "images/signature-sg.png",
            "PNG",
            30,
            y,
            50,
            25
        );

    } catch (error) {

        console.warn(
            "Signature SG non chargée :",
            error
        );

    }


    // ==============================
    // SIGNATURE PRÉSIDENT
    // ==============================

    try {

        doc.addImage(
            "images/signature-president.png",
            "PNG",
            130,
            y,
            50,
            25
        );

    } catch (error) {

        console.warn(
            "Signature Président non chargée :",
            error
        );

    }


    y += 32;


    // Lignes de signature
    doc.line(
        30,
        y,
        80,
        y
    );

    doc.line(
        130,
        y,
        180,
        y
    );


    y += 7;

    doc.setFontSize(9);
    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        "Signature",
        55,
        y,
        { align: "center" }
    );

    doc.text(
        "Signature",
        155,
        y,
        { align: "center" }
    );


    // ==============================
    // PIED DE PAGE
    // ==============================

    const pageCount =
        doc.internal.getNumberOfPages();

    for (
        let page = 1;
        page <= pageCount;
        page++
    ) {

        doc.setPage(page);

        doc.setFontSize(8);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "PDP Wérum Réw – Document officiel d'adhésion",
            105,
            290,
            { align: "center" }
        );

        doc.text(
            "Généré par Gi.Code",
            105,
            295,
            { align: "center" }
        );
    }


    // ==============================
    // TÉLÉCHARGEMENT
    // ==============================

    const numero =
        data.numeroAdherent || "PDP";

    doc.save(
        `Adhesion_${numero}.pdf`
    );

}
