function envoyerVersGoogleSheets(data){


fetch("https://script.google.com/macros/s/AKfycbx6QPrv8bpWfCFrC-0V-dErUVywvhyzE6yplw8kk6t07mXfXmrtjqwAPaBQwLqwKPl2Jg/exec",{

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