function envoyerVersGoogleSheets(data){


fetch("",{

method:"POST",

body:JSON.stringify(data)

})

.then(response=>response.json())

.then(result=>{


console.log(result);


localStorage.setItem(
"numeroAdherent",
result.numero
);


alert(
"Adhésion enregistrée : "
+result.numero
);


window.location="merci.html";


})

.catch(error=>{

console.error(error);

alert("Erreur d'envoi");

});


}
