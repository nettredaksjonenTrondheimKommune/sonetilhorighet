const fetch = require("node-fetch")
const fs = require("fs")

const URL = "https://www.trondheim.kommune.no/sokeside"

main()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

async function main() {
    let sokeside = await fetch(URL)
    let html = await sokeside.text()
    let lines = html.split("\n")
    let skoler = lines.filter(l => l.includes("unitPageRefs["))
        .filter(l => l.includes("skole"))
        .map(enhet => enhet.replace(/unitPageRefs\["[^"]+"\] =/, ""))
        .map(enhet => enhet.replace(/: '([^']+)'/, ': "$1"'))
        .map(enhet => JSON.parse(enhet))
        .map(enhet => ({ name: enhet.PageName, url: enhet.PageUrl }))

    fs.writeFileSync("src/skoler.json", JSON.stringify(skoler))

    console.log("Skrev til src/skoler.json")
}