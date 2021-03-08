const fetch = require('node-fetch');
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse';
const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};

setInterval(async () => {
    const adresser = await hent();
}, 30000);

const hent = async () => {
    let alleAdresser = [];
    const url = `${BASE_URL}/adresser?limit=60000`;
    const dokument = await fetch(url, { headers: AUTH_HEADER })
        .then(response => response.json());

    alleAdresser = (dokument.result || []).map((res) => ({
        adresse: res.gatenavn + " " + res.husnr + res.bokstav,
        gatenavn: res.gatenavn
    }));

    var sortertListe = [];

    for (var i = 0; i < alleAdresser.length; i++) {
        if (alleAdresser[i].gatenavn !== null) {
            sortertListe.push(alleAdresser[i].adresse);
        }
    }

    alleAdresser = sortertListe.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    const fs = require('fs');
    fs.writeFile('alleAdresser.json', JSON.stringify(alleAdresser), (err) => { 
        if (err) throw err; 
    });
}