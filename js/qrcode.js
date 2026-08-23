function genererQRCode(numero) {

    const zone =
        document.getElementById("qrcode");


    if (!zone) {
        return;
    }


    zone.innerHTML = "";


    if (!numero) {

        console.error(
            "Aucun numéro d'adhérent."
        );

        return;

    }


    new QRCode(
        zone,
        {
            text: numero,

            width: 180,

            height: 180,

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );

}
