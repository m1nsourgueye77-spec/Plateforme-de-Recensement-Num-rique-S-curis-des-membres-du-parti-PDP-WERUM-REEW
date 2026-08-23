function exporterExcel() {

    const data =
        chargerDonnees();


    const contenu = [

        ["Champ", "Information"],

        ["Numéro adhérent",
            data.numeroAdherent || ""],

        ["Prénom et Nom",
            data.nom || ""],

        ["Date de naissance",
            data.naissance || ""],

        ["Sexe",
            data.sexe || ""],

        ["Téléphone",
            data.telephone || ""],

        ["Quartier",
            data.quartier || ""],

        ["Profession",
            data.profession || ""],

        ["CNI Votant",
            data.cni || ""],

        ["CNI Non Votant",
            data.nonvotant || ""],

        ["Carte Électeur",
            data.electeur || ""],

        ["Région",
            data.region || ""],

        ["Département",
            data.departement || ""],

        ["Commune",
            data.commune || ""],

        ["Centre",
            data.centre || ""],

        ["Bureau",
            data.bureau || ""],

        ["Cellule",
            data.cellule || ""],

        ["Fonction",
            data.fonction || ""],

        ["Poste",
            data.poste_responsabilite || ""],

        ["Date adhésion",
            data.adhesion || ""],

        ["Collecteur",
            data.nomcollecteur || ""],

        ["Contact collecteur",
            data.contactcollecteur || ""],

        ["Date validation",
            data.dateValidation || ""]

    ];


    const csv =
        "\uFEFF" +
        contenu
            .map(ligne =>
                ligne
                    .map(cellule =>
                        '"' +
                        String(cellule)
                            .replace(/"/g, '""') +
                        '"'
                    )
                    .join(";")
            )
            .join("\r\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const lien =
        document.createElement("a");


    lien.href = url;

    lien.download =
        "Adhesion_" +
        (data.numeroAdherent || "PDP") +
        ".csv";


    document.body.appendChild(lien);

    lien.click();

    lien.remove();

    URL.revokeObjectURL(url);

}