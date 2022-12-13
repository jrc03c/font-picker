const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const process = require("process")
const watch = require("@jrc03c/watch")

function build() {
  try {
    console.log("\n==========\n")
    console.log(`Building... (${new Date().toLocaleString()})`)

    const distDir = path.join(__dirname, "dist")

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }

    const srcFile = path.join(__dirname, "src", "index.js")
    const outFile1 = path.join(distDir, "font-picker.js")
    const outFile2 = path.join(__dirname, "demo", "font-picker.js")

    execSync(`npx esbuild "${srcFile}" --bundle --outfile="${outFile1}"`, {
      encoding: "utf8",
    })

    execSync(`cp "${outFile1}" "${outFile2}"`, {
      encoding: "utf8",
    })

    console.log("\nBuilt! 🎉\n")
  } catch (e) {
    console.log(e)
  }
}

if (process.argv.indexOf("--watch") > -1) {
  watch({
    target: "src",
    created: build,
    modified: build,
    deleted: build,
  })
}

build()
