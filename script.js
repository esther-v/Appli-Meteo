const CLEAPI = '488a87570b1e8e64f249ce4a35195a9e'; 
let resultatsAPI;
let resultatsAPIForecast;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature')
const localisation = document.querySelector('.localisation')
const heure = document.querySelectorAll('.heure-prevision')
const tempPourH = document.querySelectorAll('.temp-prevision')
const imgIcone = document.querySelector('.icone-meteo');
const joursDiv = document.querySelectorAll('.jour-prevision');
const tempJoursDiv = document.querySelectorAll('.temp-day-prevision');

let heureActuelle = new Date().getHours();


// Affichage/Gestion des jours
const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi', 'Dimanche']

let ajd = new Date();
let options = {weekday: 'long'};
let jourActuel = ajd.toLocaleDateString('fr-FR', options);
jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);
let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));




if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);
        apiForecast3Hour(long, lat);

    }, () => {
        alert(`Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer`)

    })
}

function AppelAPI(long, lat) {
    
    // 
    // https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${CLEAPI}&lang=fr&units=metric
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${CLEAPI}&lang=fr&units=metric`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        resultatsAPI = data;

        localisation.textContent = resultatsAPI.name;
        temps.innerText = resultatsAPI.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.main.temp)}°`

        
        //icone dynamique


        if(heureActuelle >= 7 && heureActuelle < 20) {
            imgIcone.src = `ressources/jour/${resultatsAPI.weather[0].icon}.svg`
        } else  {
           imgIcone.src = `ressources/nuit/${resultatsAPI.weather[0].icon}.svg`
        }
        

    })

}


function apiForecast3Hour(long, lat) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${CLEAPI}&units=metric`)
    .then((response) => {
        return response.json();
    })
    .then((donnees) => {
        resultatsAPIForecast = donnees;

        // les heures par tranche de 3

        for(let i=0; i < heure.length; i++) {

            let heureIncr = heureActuelle + (i * 3);

            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`
            }   else if(heureIncr === 24) {
                heure[i].innerText = "00 h"
            } else {
                heure[i].innerText = `${heureIncr} h`;
            }
            
        }

        // temp pour 3h

        for(let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(resultatsAPIForecast.list[j * 3].main.temp)}°`
        }

        // trois premieres lettres des jours 

        for(let k = 0; k < tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }

        // Temps par jour
        for(let m = 0; m < 7; m++){
            tempJoursDiv[m].innerText = `${Math.trunc(resultatsAPIForecast.list[m + 1].main.temp)}°`
        }

    })
    
    
}