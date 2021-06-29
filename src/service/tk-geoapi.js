import leven from 'leven';
import { fetchJSON } from './fetchJSON';
import helsestasjoner from './helsestasjoner.json';
import omsorgssoner from './omsorgssoner.json';
import skoler from './skoler.json';

/**
 * Søk etter soner innen kommunen.
 */
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse';
const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};

export default async function finnSoner(adresse, altAdresse, sonetype) {
    let forventetVerdi = adresse.trim().toLowerCase();

    if (forventetVerdi === '') {
        throw new Error('Invalid adress');
    }

    var url = `${BASE_URL}/${sonetype}/${encodeURIComponent(forventetVerdi)}`;
    var dokument = await fetchJSON(url, { headers: AUTH_HEADER });

    if (dokument.totaltAntallTreff === 0) {
        if (forventetVerdi.match(/ [0-9]/) !== null) {
            return finnSoner(adresse.slice(0, adresse.length - 1), altAdresse, sonetype);
        }

        if (sonetype === 'finnhelsestasjon' || sonetype === 'adresserkretser') {
            forventetVerdi = altAdresse.trim().toLowerCase();
            url = `${BASE_URL}/${sonetype}/${encodeURIComponent(forventetVerdi)}`;
            dokument = await fetchJSON(url, { headers: AUTH_HEADER });
        }
    }

    var adresseInfo = [];

    if (dokument.result.length === 0) {
        return adresseInfo = [];
    }

    if (sonetype === 'finnhelsestasjon') {
        adresseInfo = (dokument.result || []).map(res => ({
            adresse: res.adresse,
            helsestasjonsonenavn: `${res.helsestasjonsonenavn} helsestasjon`,
            lenke: `https://trondheim.kommune.no/` + `${res.helsestasjonsonenavn}-helsestasjon`
                .toLowerCase()
                .replace(/[^a-zæøå]/g, '-')
                .replace(/æ/g, 'a')
                .replace(/ø/g, 'o')
                .replace(/å/g, 'a')
        }));
    }

    if (sonetype === 'finnbydel') {
        adresseInfo = (dokument.result || []).map(res => ({
            adresse: adresse,
            geomb: res.geom.coordinates[0],
            geoml: res.geom.coordinates[1],
            bydelnavn: res.bydelnavn
        }));
    }

    if (sonetype === 'adresserkretser') {
        adresseInfo = (dokument.result || []).map(res => ({
            adresse: res.adresse,
            omsorgsone: `${res.omsorgsone} hjemmetjeneste`,
            barneskolekrets: res.barneskolekrets.toLowerCase(),
            ungdomskolekrets: res.ungdomskolekrets.toLowerCase(),
            valgkrets: res.Valgkrets.toLowerCase(),
            lenkeHjemmetjeneste: `https://trondheim.kommune.no/org/helse-og-velferd/hjemmetjenester/` + `${res.omsorgsone}-hjemmetjeneste`
                .toLowerCase()
                .replace(/[^a-zæøå]/g, '-')
                .replace(/æ/g, 'a')
                .replace(/ø/g, 'o')
                .replace(/å/g, 'a'),
            lenkeBarneskole: findSkoleUrl([`${res.barneskolekrets.toLowerCase()} skole`, res.barneskolekrets.toLowerCase()]),
            lenkeUngdomskole: findSkoleUrl([`${res.ungdomskolekrets.toLowerCase()} skole`, res.ungdomskolekrets.toLowerCase()])
        }));
    }

    adresseInfo = adresseInfo.find(a => a.adresse === adresse || a.adresse === altAdresse);

    if (sonetype === 'finnhelsestasjon') {
        for (var i = 0; i < helsestasjoner.length; i++) {
            if (adresseInfo.helsestasjonsonenavn === "Falkenborg helsestasjon") {
                adresseInfo.helsestasjonsonenavn = "Falkenborg helsestasjon (barn 0-5 år)";
            }

            if (helsestasjoner[i].helsestasjonsonenavn === adresseInfo.helsestasjonsonenavn) {
                adresseInfo = { ...adresseInfo, ...helsestasjoner[i] };
            }
        }
    }

    if (sonetype === 'adresserkretser') {
        for (var j = 0; j < omsorgssoner.length; j++) {
            if (omsorgssoner[j].hjemmetjeneste === adresseInfo.omsorgsone) {
                adresseInfo = { ...adresseInfo, ...omsorgssoner[j] };
            }
        }
    }

    return adresseInfo;
}

function findSkoleUrl(names) {
    const namesLower = names.map((n) => n.toLowerCase());
    const skole = skoler.find((s) => {
        const name = s.name.toLowerCase();
        return namesLower.some((n) => name.startsWith(n) || leven(n, name) <= 2);
    });

    if (!skole || !skole.url) {
        console.error(`Unable to find URL for ${names}`);
        return null;
    }

    return `https://www.trondheim.kommune.no/${skole.url}`;
}