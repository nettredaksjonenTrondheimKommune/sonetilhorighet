import leven from 'leven';
import { fetchJSON, toRequestQuery } from './fetchJSON';
import { reportFetchSuccess, reportFetchError, reportFetchRequest } from './fetch.actions';

const BASE_URL = 'https://trv.no/wp-json/wasteplan/v1/';
const SERVICE_NAME = 'tommekalender';

const noop = () => { };
export default async function fetchPlaner(adresse, dispatch = noop) {
    dispatch(reportFetchRequest(SERVICE_NAME));

    try {
        const locations = await fetchLocations(adresse);
        let planer = await Promise.all(locations.map((location) => fetchCalendar(location, adresse)));
        planer = planer.filter((p) => p !== null);

        planer.sort(sortByNameDistanceToNumber(adresse));
        bestMatchFirst(planer, adresse);

        dispatch(reportFetchSuccess(SERVICE_NAME));
        console.log(planer);
        return planer;
    } catch (error) {
        dispatch(reportFetchError(SERVICE_NAME, error));
    }
}

async function fetchLocations(adresse) {
    if (!adresse || adresse.length === 0) {
        return [];
    }

    /**
     * API interprets spaces as or, such that a search
     * for "general buddes gate" gives any streets matching
     * either general, buddes or gate.
     *
     * The API has a special case for veg and vei, where the
     * word is removed from the search, but this special case
     * does not exists for gate.
     *
     * Strategy:
     * 1. Remove " gate"
     * 2. Filter results, such that they contain
     *    all words in search adresse.
     */

    // step 1 in strategy from above
    const s = adresse.replace(/ gate([^a-zæøå0-9])?/, '$1');

    const query = toRequestQuery({ s });
    let locations = await fetchJSON(`${BASE_URL}locations${query}`);

    // step 2 in strategy from above
    locations = removeLocationsNotMatchingadresse(locations, adresse);

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
        throw new Error(`Did not find any locations for ${adresse}`);
    }

    return locations.map((l) => ({
        id: l.id,
        name: l.name,
    }));
}

async function fetchCalendar(location) {
    const plan = await fetchJSON(`${BASE_URL}calendar/${location.id}`);

    if (!plan || !Array.isArray(plan.calendar) || plan.calendar.length === 0) {
        // eslint-disable-next-line no-console
        console.error(`Did not find calendar for ${location.name} (${location.id})`);
        return null;
    }

    const calendar = removeOrMergeDuplicates(plan.calendar);
    const descriptions = getAllDescriptions(plan.calendar);
    removeCalendarDescriptions(plan.calendar);

    return {
        id: plan.id,
        name: plan.name,
        type: normalizeType(plan.type),
        calendar,
        descriptions,
    };
}

function normalizeType(type) {
    const allowed = ['bins', 'containers'];
    const normalized = type.toLowerCase();

    if (allowed.includes(normalized)) {
        return normalized;
    }
    // eslint-disable-next-line no-console
    console.warn(`Unknown type ${type}, expected one of ${allowed}`);
    return 'unknown';
}

/**
 * API can give same week more then once. Upon duplicate weeks,
 * remove "No pickup" and merge others.
 */
function removeOrMergeDuplicates(calendar) {
    return calendar.reduce((filtered, entry) => {
        if (filtered.some((e) => sameYearAndWeek(e, entry))) {
            return filtered;
        }

        const allOfSameWeek = calendar.filter((e) => sameYearAndWeek(e, entry));
        if (allOfSameWeek.length === 1) {
            filtered.push(entry);
            return filtered;
        }

        // "No pickup" has no description
        const withoutNoPickup = allOfSameWeek.filter((e) => e.description !== null);
        if (withoutNoPickup.length === 1) {
            filtered.push(withoutNoPickup[0]);
            return filtered;
        }

        const mergedEntry = {
            year: entry.year,
            week: entry.week,
            date: entry.date,
            description: withoutNoPickup.reduce(
                (description, value) => ({ ...description, ...value.description }),
                {},
            ),
            wastetype: withoutNoPickup.map((e) => e.wastetype).join(', '),
            date_week_start: entry.date_week_start,
            date_week_end: entry.date_week_end,
            day_of_week: entry.day_of_week,
        };
        filtered.push(mergedEntry);

        for (var i = 0; i < filtered.length; i++) {
            var start = filtered[i].date_week_start.split('-');
            filtered[i].date_week_start = start[2] + "." + start[1] + "." + start[0];
            var slutt = filtered[i].date_week_end.split('-');
            filtered[i].date_week_end = slutt[2] + "." + slutt[1] + "." + slutt[0];
        }

        return filtered;
    }, []);
}

function sameYearAndWeek(a, b) {
    return a.week === b.week && a.year === b.year;
}

/**
 * If we get a perfect match on plan name and adresse,
 * make sure that plan is the first one in list.
 *
 * Example:
 *
 * Searching for "okstadøy" gives the posibilities:
 * - "Okstadøy (bins)"
 * - "Okstadøy 2 , 4 (container)"
 * - "Okstadøy 45 (container)"
 * - "Okstadøy 47 (container)"
 * - "Okstadøy 76 (container)"
 *
 * Expected results are:
 * - "Okstadøy 45" -> "Okstadøy 45 (container)"
 * - "Okstadøy 1" -> "Okstadøy (bins)"
 * - "Okstadøy 2" -> "Okstadøy 2 , 4 (container)"
 * - "Okstadøy 4" -> "Okstadøy 2 , 4 (container)"
 */
function bestMatchFirst(planer, adresse) {
    const exactMatch = planer.findIndex((p) => p.name === adresse);

    if (exactMatch !== -1) {
        moveToFront(exactMatch, planer);
        return;
    }

    const partialMatch = planer.findIndex((plan) => nameAndNumberMatches(plan.name, adresse));
    if (partialMatch !== -1) {
        moveToFront(partialMatch, planer);
        return;
    }

    const binMatch = planer.findIndex((plan) => isBinAndNameMatches(plan, adresse));
    if (binMatch !== -1) {
        moveToFront(binMatch, planer);
        return;
    }

    // eslint-disable-next-line no-console
    console.warn('No partial match for name, assuming first bin is correct');
    const firstBin = planer.findIndex(isBin);
    if (firstBin !== -1) {
        moveToFront(firstBin, planer);
        return;
    }

    // eslint-disable-next-line no-console
    console.warn('No bins found, only sorted by name number');
}

function nameAndNumberMatches(planName, adresse) {
    const planNumbers = numbersInText(planName);
    const adresseNumbers = numbersInText(adresse);

    return (
        withoutNumberOrComma(planName) === withoutNumberOrComma(adresse) &&
        planNumbers.some((n) => adresseNumbers.includes(n))
    );
}

function withoutNumberOrComma(adresse) {
    return adresse.match(/^[^0-9,]+/)[0].trim();
}

function numbersInText(adresse) {
    return (adresse.match(/[0-9]+/g) || []).map(parseInt);
}

function moveToFront(index, array) {
    const toMove = array.splice(index, 1);
    array.unshift(...toMove);
}

function isBinAndNameMatches(plan, adresse) {
    const planName = plan.name.toLowerCase();
    const adresseName = withoutNumberOrComma(adresse).toLowerCase();
    return isBin(plan) && planName.startsWith(adresseName);
}

function isBin(plan) {
    return plan.type === 'bins';
}

function sortByNameDistanceToNumber(adresse) {
    return (a, b) => {
        const aName = withoutNumberOrComma(a.name);
        const bName = withoutNumberOrComma(b.name);

        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        const adresseNumber = firstNumberInText(adresse);
        const aNumberDistance = Math.abs(firstNumberInText(a.name) - adresseNumber);
        const bNumberDistance = Math.abs(firstNumberInText(b.name) - adresseNumber);
        return aNumberDistance - bNumberDistance;
    };
}

function firstNumberInText(text) {
    return numbersInText(text)[0] || -1000;
}

/**
 * Computes edit distance between words in adresse and location name.
 * All words in adresse has a edit distance equal or below 2, we
 * consider it a match.
 */
function removeLocationsNotMatchingadresse(locations, adresse) {
    const wordsInadresse = wordsThatAreNotNumbers(adresse);

    return locations.filter(
        (location) => worstEditDistanceToAnyWordIn(location.name, wordsInadresse) <= 2,
    );
}

function wordsThatAreNotNumbers(text) {
    return text.split(' ').filter(isNotANumber);
}

function isNotANumber(word) {
    return word.match(/[0-9]/) === null;
}

function worstEditDistanceToAnyWordIn(text, wordsToMatch) {
    const wordsInText = wordsThatAreNotNumbers(text);
    const minimumEditDistances = wordsToMatch.map((wordToMatch) =>
        Math.min(...wordsInText.map((w) => leven(w, wordToMatch))),
    );

    return Math.max(...minimumEditDistances);
}

function getAllDescriptions(calendar) {
    let allTypes = calendar
        .map((week) => week.wastetype)
        // some weeks have joined wastetype -> join + split
        .join(', ')
        .split(', ');
    let allDescriptions = calendar.reduce(
        (descriptions, week) => ({
            ...descriptions,
            ...week.description,
        }),
        {},
    );

    let descriptions = unique(allTypes).map((name) => ({
        name,
        description: allDescriptions[name],
    }));

    descriptions.sort(byName);

    return descriptions;
}

function removeCalendarDescriptions(calendar) {
    calendar.forEach((week) => delete week.description);
}

function unique(array) {
    return Array.from(new Set(array));
}

function byName(a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}