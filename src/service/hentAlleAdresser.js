import { fetchJSON } from './fetchJSON';

/**
 * Henter alle adresser i kommunen.
 */
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse/';
const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};

export default async function hentAlleAdresser() {
    const cachedAdresser = JSON.parse(localStorage.getItem('alleAdresser'));
    let alleAdresser = [];

    if(cachedAdresser) {
        alleAdresser = cachedAdresser;
    } else {
        const url = `${BASE_URL}/adresser?limit=55000`;
        const dokument = await fetchJSON(url, { headers: AUTH_HEADER });

        alleAdresser = (dokument.result || []).map((res) => ({
            adresse: res.gatenavn + " " + res.husnr + res.bokstav,
            gatenavn: res.gatenavn
        }));

        var sortertListe = [];

        for(var i = 0; i < alleAdresser.length; i++) {
            if(alleAdresser[i].gatenavn !== null) {
                sortertListe.push(alleAdresser[i]);
            }
        }

        alleAdresser = sortertListe.sort((a, b) => a.adresse.localeCompare(b.adresse, undefined, { numeric: true, sensitivity: 'base' }));

        localStorage.setItem('alleAdresser', JSON.stringify(alleAdresser));

        return alleAdresser;
    }

    return alleAdresser;
}