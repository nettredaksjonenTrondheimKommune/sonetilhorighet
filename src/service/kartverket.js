/**
 * Søk etter adresser fra Kartverkets API.
 */
 import proj from 'proj4';
 import { fetchJSON, toRequestQuery } from './fetchJSON';
 import { reportFetchError, reportFetchSuccess, reportFetchRequest } from './fetch.actions';
 
 proj.defs('EPSG:4258', '+title=ETRS89 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ');
 proj.defs(
   'EPSG:6172',
   '+title=ETRS89 / UTM zone 32 + NN54 height +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs',
 );
 
 const BASE_URL = 'https://ws.geonorge.no/adresser/v1/sok';
 
 export async function adresseSok(adresse) {
   const shouldSearchForNumberOne = !hasDigits(adresse);
   let query = createSearchQuery(adresse, shouldSearchForNumberOne);
 
   let document = await fetchJSON(BASE_URL + query);
   let adresser = document.adresser || [];
 
   if (adresser.length === 0 && shouldSearchForNumberOne) {
     query = createSearchQuery(adresse, false);
     document = await fetchJSON(BASE_URL + query);
     adresser = document.adresser || [];
   }
 
   return adresser.map((a) => a.adressetekst);
 }
 
 const noop = () => {};
 const SERVICE_NAME = 'kartverket';
 
 export async function getCoordinate(address, dispatch = noop) {
   if (!address || !address.length) {
     dispatch(reportFetchError(SERVICE_NAME, `Ugyldig adresse: ${address}`));
     return {};
   }
 
   dispatch(reportFetchRequest(SERVICE_NAME));
 
   try {
     const query = createGetCoordinateQuery(address);
     const response = await fetchJSON(BASE_URL + query);
 
     if (!response || !response.adresser || !Array.isArray(response.adresser)) {
       throw new Error(`Got zero results for ${address}`);
     }
 
     if (response.adresser.length === 0) {
       throw new Error(`Got invalid result for ${address}: ${JSON.stringify(response)}`);
     }
 
     let match = response.adresser.find(
       (a) => a.adressetekst.toLowerCase() === address.toLowerCase(),
     );
 
     if (!match && response.adresser.length === 1) {
       [match] = response.adresser;
       // eslint-disable-next-line no-console
       console.warn(
         `Got one result for ${address}, but address did not match: ${JSON.stringify(match)}`,
       );
     } else if (!match && response.adresser.length > 1) {
       [match] = response.adresser;
       // eslint-disable-next-line no-console
       console.warn(
         `Got more then one result for ${address}, assuming first is correct: ${JSON.stringify(
           match,
         )}`,
       );
     } else if (!match) {
       throw new Error(`Got invalid result for ${address}: ${JSON.stringify(response)}`);
     }
 
     // {"representasjonspunkt":{"epsg":"EPSG:4258","lat":63.41459830944605,"lon":10.366912994260725}}
     const coordinate = match.representasjonspunkt;
     // project to UTM 32, such that distance can be calculated in meters
     const [x, y] = proj(coordinate.epsg, 'EPSG:6172', [coordinate.lon, coordinate.lat]);
 
     dispatch(reportFetchSuccess(SERVICE_NAME));
 
     return { x, y };
   } catch (error) {
     dispatch(reportFetchError(SERVICE_NAME, error));
     return {};
   }
 }
 
 const queryDefaults = {
   kommunenummer: 5001, // Trondheim
   asciiKompatibel: false, // strings as UTF8
 };
 
 function createSearchQuery(adresse, shouldSearchForNumberOne) {
   const normalizedAdresse = normalize(adresse);
   // Wildcard in end - assume user searches for start
   // of street name.
   const sok = `${normalizedAdresse}*`;
 
   // If digits not included - search for first house number,
   // which avoids street duplicates
   // Assumption: All streets have number 1.
   const nummer = shouldSearchForNumberOne ? 1 : null;
   const filtrer = 'adresser.adressetekst';
 
   return toRequestQuery({
     sok,
     nummer,
     filtrer,
     ...queryDefaults,
   });
 }
 
 function createGetCoordinateQuery(adressetekst) {
   return toRequestQuery({
     adressetekst,
     filtrer: 'adresser.representasjonspunkt,adresser.adressetekst',
     ...queryDefaults,
   });
 }
 
 /**
  * removes chars that are not letters or digits
  */
 function normalize(text) {
   return text
     .toLowerCase()
     .trim()
     .replace(/[^a-zæøå0-9 ]/, '');
 }
 
 function hasDigits(text) {
   return text.search(/[0-9]/) !== -1;
 }
 