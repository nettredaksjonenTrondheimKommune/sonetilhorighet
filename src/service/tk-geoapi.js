import leven from 'leven';
import { fetchJSON } from './fetchJSON';
import skoler from './skoler.json';
import { reportFetchSuccess, reportFetchRequest, reportFetchError } from './fetch.actions';

/**
 * Søk etter soner innen kommunen.
 */
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse/';
const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};
const SERVICE_NAME = 'tk-geoapi';

const noop = () => { };
export default async function finnSoner(adresse, dispatch = noop) {
    dispatch(reportFetchRequest(SERVICE_NAME));
    const promises = [
        // fetchAndSelect(adresse, 'adresserkretser'),
        // fetchAndSelect(adresse, 'finnbydel'),
        fetchAndSelect(adresse, 'finnhelsestasjon')
    ];

    try {
        const results = await Promise.all(promises);
        const [helsestasjonTreff] = results;
        dispatch(reportFetchSuccess(SERVICE_NAME));

        if(results[0].adresse === adresse) {
            return [
                helsestasjon(helsestasjonTreff),
            ];
        } else {
            return results;
        }

        // if(results[2] !== null) {
        //     const [soner, bydelTreff, helsestasjonTreff] = results;
        //     dispatch(reportFetchSuccess(SERVICE_NAME));
    
        //     return [
        //         barneskole(soner),
        //         bydel(bydelTreff),
        //         helsesone(soner),
        //         helsestasjon(helsestasjonTreff),
        //         ungdomsskole(soner),
        //         valgkrets(soner)
        //     ];
        // }
    } catch (error) {
        dispatch(reportFetchError(SERVICE_NAME, error));
    }
}

async function fetchAndSelect(adresse, endpoint) {
    const url = `${BASE_URL + endpoint}/${encodeURIComponent(adresse)}`;
    const document = await fetchJSON(url, { headers: AUTH_HEADER });
    const adresser = (document.result || []).map((a) => ({
        ...a,
        adresse: a.adresse.toLowerCase(),
    }));
    let treff = adresser.find((a) => a.adresse === adresse);
    treff = treff || adresser.find((a) => a.adresse.startsWith(adresse));
    treff = treff || adresser.find((a) => leven(a.adresse, adresse) <= 2);

    if(typeof treff === 'undefined') {
        treff = {adresse: "Finner du ikke adressen din? Prøv å endre skrivemåte, for eksempel på veg/vei?", navn: "", verdi: "", lenke: ""};
    } else {
        if(treff.adresse !== adresse) {
            treff = {adresse: "Har du husket å skrive gatenummer og eventuelt bokstav?", navn: "", verdi: "", lenke: ""};
        }
    }

    return treff;
}

// function capitalize(text) {
//     return text[0].toUpperCase() + text.slice(1).toLowerCase();
// }

/**
 * Response is:
 * {
 *    "adresse": "Gisle Johnsons gate 1",
 *    "bydelnavn": "\u00d8stbyen",
 *    "geom": {
 *        "coordinates": [
 *            10.431112969091,
 *            63.4379459840773
 *        ],
 *        "type": "Point"
 *    },
 *    "kretsnavn": "TRONDHEIM",
 *    "kretsnr": 7067
 * },

 */
// function bydel(treff) {
//     return {
//         navn: 'bydel',
//         verdi: treff.bydelnavn,
//         lenke: null,
//     };
// }

/**
 * Response is:
 *
 * {
 *    "Grunnkrets": "SJETNE-OKSTAD 6",
 *    "Kirkesogn": "Tiller",
 *    "KommunalKrets": "OKSTAD",
 *    "Valgkrets": "SJETNE",
 *    "adresse": "Okstadvegen 153",
 *    "barneskolekrets": "OKSTAD",
 *    "geom": {
 *      "coordinates": [
 *        10.3867391169599,
 *        63.3788520041741
 *      ],
 *      "type": "Point"
 *    },
 *    "helsesone": "HEIMDAL",
 *    "id": 276466235,
 *    "kretsnavn": "TILLER",
 *    "kretsnr": 7075,
 *    "ungdomskolekrets": "SJETNE SKOLE"
 * },
 */
// function valgkrets(soner) {
//     return {
//         navn: 'valgkrets',
//         verdi: capitalize(soner.Valgkrets),
//         lenke: null,
//     };
// }

// function barneskole(soner) {
//     const kunNavn = capitalize(soner.barneskolekrets);
//     const skole = `${kunNavn} skole`;

//     return {
//         navn: 'barneskole',
//         verdi: skole,
//         lenke: findSkoleUrl([skole, `${kunNavn} barneskole`]),
//     };
// }

// function helsesone(soner) {
//     return {
//         navn: 'helsesone',
//         verdi: capitalize(soner.helsesone),
//         lenke: null,
//     };
// }

// function ungdomsskole(soner) {
//     const skole = soner.ungdomskolekrets;
//     const kunNavn = skole.split(' ')[0].toLowerCase();

//     return {
//         navn: 'ungdomsskole',
//         verdi: capitalize(skole),
//         lenke: findSkoleUrl([`${kunNavn} skole`, skole]),
//     };
// }

// function findSkoleUrl(names) {
//     const namesLower = names.map((n) => n.toLowerCase());
//     const skole = skoler.find((s) => {
//         const name = s.name.toLowerCase();
//         return namesLower.some((n) => name.startsWith(n) || leven(n, name) <= 2);
//     });

//     if (!skole || !skole.url) {
//         // eslint-disable-next-line no-console
//         console.error(`Unable to find URL for ${names}`);
//         return null;
//     }

//     return `https://www.trondheim.kommune.no/${skole.url}`;
// }

/**
 * {
 *   "adresse": "Okstadvegen 1",
 *   "geom": {
 *     "coordinates": [
 *       10.3779335382311,
 *       63.3825050701357
 *     ],
 *     "type": "Point"
 *   },
 *   "helsestasjonsonenavn": "Romolslia",
 *   "kretsnavn": "TILLER",
 *   "kretsnr": 7075
 * }
 */
function helsestasjon(treff) {
    const adresse = treff.adresse;
    const navn = `${treff.helsestasjonsonenavn} helsestasjon`;
    const normalisertNavn = navn
        .toLowerCase()
        .replace(/[^a-zæøå]/g, '-')
        .replace(/æ/g, 'a')
        .replace(/ø/g, 'o')
        .replace(/å/g, 'a');

    const lenke = `https://trondheim.kommune.no/${normalisertNavn}`;

    return {
        adresse: adresse,
        navn: 'helsestasjon',
        verdi: navn,
        lenke,
    };
}
