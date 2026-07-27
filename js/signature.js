// ====================================
// Signature électronique
// ====================================

const canvas = document.getElementById("signature");

if(canvas){

    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    let dessiner = false;


    canvas.addEventListener("mousedown", function(){
        dessiner = true;
    });


    canvas.addEventListener("mouseup", function(){

        dessiner = false;
        ctx.beginPath();

        sauvegarderSignature();

    });


    canvas.addEventListener("mousemove", dessinerSignature);


    function dessinerSignature(e){

        if(!dessiner) return;


        const rect = canvas.getBoundingClientRect();


        ctx.lineWidth = 2;
        ctx.lineCap = "round";


        ctx.lineTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );


        ctx.stroke();


        ctx.beginPath();


        ctx.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );

    }



    window.effacerSignature=function(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        sauvegarderSignature();

    }



    function sauvegarderSignature(){

        const champ = document.getElementById("signatureData");


        if(champ){

            champ.value = canvas.toDataURL();

        }

    }

}