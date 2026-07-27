// =================================
// Géolocalisation
// =================================

function obtenirPosition() {

    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas disponible sur cet appareil.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            document.getElementById("gps").value =
                position.coords.latitude + ", " + position.coords.longitude;

        },

        function(error) {

            alert("Impossible de récupérer votre position.");

            console.error(error);

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}