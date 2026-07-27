// ======================================
// QR Code
// ======================================

function genererQRCode(){

    const numero = localStorage.getItem("numeroAdherent");

    const zoneQR = document.getElementById("qrcode");


    if(numero && zoneQR){

        new QRCode(
            zoneQR,
            {
                text: numero,
                width: 150,
                height: 150
            }
        );

        console.log("QR Code généré :", numero);

    }else{

        console.log("Numéro adhérent introuvable");

    }

}
