const child_process = require("child_process")
const pkg = require("./package.json")

if (!process.env.CI) {
  child_process.execSync(`zip -r ${pkg.name}-${pkg.version}.zip ${pkg.name}`)
}
