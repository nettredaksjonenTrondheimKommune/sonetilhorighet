const fetch = require('node-fetch');
const fs = require('fs');
const filnavn = './alleAdresser.json';
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse';
const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};

const hent = async () => {
    if (fs.existsSync(filnavn)) {
        try {
            fs.unlinkSync(filnavn);
        } catch(err) {
            console.error(err);
        }
    }

    let alleAdresser = [];
    const url = `${BASE_URL}/adresser?limit=60000`;
    const dokument = await fetch(url, { headers: AUTH_HEADER })
        .then(response => response.json());

    alleAdresser = (dokument.result || []).map((res) => ({
        orginalAdresse: res.adresse,
        adresse: res.gatenavn + " " + res.husnr + res.bokstav,
        gatenavn: res.gatenavn
    }));

    var sortertListe = [];

    for (var i = 0; i < alleAdresser.length; i++) {
        if (alleAdresser[i].gatenavn !== null) {
            sortertListe.push({
                adresse: alleAdresser[i].adresse,
                orginalAdresse: alleAdresser[i].orginalAdresse,
                lowerCaseAdresse: alleAdresser[i].adresse.toLowerCase()
            });
            // sortertListe.push(alleAdresser[i].adresse);
        }
    }
    
    alleAdresser = sortertListe.sort((a, b) => a.adresse.localeCompare(b.adresse, undefined, { numeric: true, sensitivity: 'base' }));

    fs.writeFile(filnavn, JSON.stringify(alleAdresser), (err) => { 
        if (err) throw err; 
    });
}

hent();