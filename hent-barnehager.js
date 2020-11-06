const fetch = require("node-fetch")
const fs = require("fs")
const proj = require("proj4")

proj.defs("EPSG:4258", "+title=ETRS89 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ");
proj.defs("EPSG:6172", "+title=ETRS89 / UTM zone 32 + NN54 height +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs");

const URL = "https://www.trondheim.kommune.no/sokeside"
const BLUEGARDEN = "https://bluegarden.trondheim.kommune.no/c438f66d-2b18-40a3-9e22-547e8cf58a21/api/unit/"
const KARTVERKET = "https://ws.geonorge.no/adresser/v1/sok"

main()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

async function main() {
    let sokeside = await fetch(URL)
    let html = await sokeside.text()
    let lines = html.split("\n")
    let barnehager = lines.filter(l => l.includes("unitPageRefs["))
        .filter(l => l.includes("barnehage"))
        .map(enhet => enhet.replace(/unitPageRefs\["[^"]+"\] =/, ""))
        .map(enhet => enhet.replace(/: '([^']+)'/, ': "$1"'))
        .map(enhet => JSON.parse(enhet))
        .map(enhet => ({ id: enhet.UnitRef, name: enhet.PageName, url: enhet.PageUrl }))

    let info = await Promise.all(barnehager.map(get_address_from_bluegarden))
    barnehager = barnehager.map((barnehage, i) => ({ ...barnehage, ...info[i]}))

    let coordinates = await Promise.all(barnehager.map(get_coordinate_from_kartverket))
    barnehager = barnehager.map((barnehage, i) => ({ ...barnehage, ...coordinates[i]}))

    fs.writeFileSync("src/barnehager.json", JSON.stringify(barnehager))

    console.log(`Skrev ${barnehager.length} barnehager til til src/barnehager.json`)
}

async function get_address_from_bluegarden(barnehage) {
    let id = barnehage.id
    let info = await graceful_fetch_json(BLUEGARDEN + id, `${barnehage.name} [${id}]`)

    let address = ((info.Adresse || {}).Street || "")
        .replace(/([0-9]+)-[0-9]+$/, "$1") // "Spongdalsvegen 67-69" -> "Spongdalsvegen 67"

    return {
        address,
        // phone: info.Phone,
        // privat: info.isPrivate,
    }
}

async function get_coordinate_from_kartverket(barnehage) {
    let context = `${barnehage.name}, ${barnehage.address} [${barnehage.id}]`

    if (!barnehage.address || !barnehage.address.length) {
        console.error(`Ingen adresse for ${context}`)
        return {}
    }
    let query = toRequestQuery({
        kommunenummer: 5001, // trondheim
        asciiKompatibel: false, // strings as UTF8
        sok: barnehage.address,
        filtrer: "adresser.representasjonspunkt,adresser.adressetekst"
    });

    let response = await graceful_fetch_json(KARTVERKET + query, context);

    if (!response || !response.adresser || !Array.isArray(response.adresser)) {
        console.error(`Got invalid results for ${context}: ${JSON.stringify(response)}`)
        return {}
    }

    if (response.adresser.length === 0) {
        console.error(`Got zero results for ${context}`)
        return {}
    }

    let match = response.adresser.find(a => a.adressetekst.toLowerCase() === barnehage.address.toLowerCase())

    if (!match && response.adresser.length === 1) {
        match = response.adresser[0]
        console.warn(`Got one result for ${context}, but address did not match: ${JSON.stringify(match)}`)
    } else if (!match && response.adresser.length > 1) {
        match = response.adresser[0]
        console.warn(`Got more then one result for ${context}, assuming first is correct: ${JSON.stringify(match)}`)
    } else if (!match) {
        console.error(`Got invalid result for ${context}: ${JSON.stringify(response)}`)
        return {}
    }

    // {"representasjonspunkt":{"epsg":"EPSG:4258","lat":63.41459830944605,"lon":10.366912994260725}}
    let coordinate = match.representasjonspunkt
    // project to UTM 32, such that distance can be calculated in meters
    let [x, y] = proj(coordinate.epsg, "EPSG:6172", [coordinate.lon, coordinate.lat])

    return { coordinate: { x, y } }
}

function toRequestQuery(object) {
    let parameters = []

    for (let key in object) {
        if (object.hasOwnProperty(key) && object[key] !== null) {
            let value = encodeURIComponent(object[key])
            parameters.push([key, value])
        }
    }

    return "?" + parameters.map(([key, value]) => `${key}=${value}`).join("&")
}

async function graceful_fetch_json(url, context, retry = 0) {
    if (retry > 5) {
        console.error(`Could not get ${url} (${context}), retried 5 times.`)
        return {}
    } else if (retry > 0) {
        await sleep(retry * 5 * 1000)
    }

    let response = await fetch(url)

    if (response.status !== 200) {
        let body = await response.text()
        console.error(`Could not get ${url} (${context}), got ${response.status} with body '${body}', retrying.`)
        return await graceful_fetch_json(url, context, retry + 1)
    }

    let doc = await response.json()

    if (!doc) {
        console.error(`Could not get ${url} (${context}), got ${response.status} with json '${doc}'.`)
        return {}
    }

    return doc
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}