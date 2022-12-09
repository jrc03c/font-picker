const fetch = require("node-fetch")
const process = require("process")
const webSafeFonts = require("./web-safe-fonts")

function createFont(family, data) {
  return {
    family,
    files: data && data.files ? data.files : [],
    variants:
      data && data.variants
        ? data.variants
        : ["regular", "bold", "regular-italic", "bold-italic"],
  }
}

function sort(x, fn) {
  if (!fn) {
    fn = (a, b) => (a < b ? -1 : 1)
  }

  const out = (() => {
    try {
      return structuredClone(x)
    } catch (e) {
      return x.slice()
    }
  })()

  out.sort(fn)
  return out
}

module.exports = async function getAllFonts(request, response) {
  try {
    const innerResponse = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_WEBFONTS_API_KEY}`
    )

    const fontData = await innerResponse.json()

    const allFonts = sort(
      fontData.items
        .map(item => {
          return createFont(item.family, item)
        })
        .concat(
          webSafeFonts.map(family => {
            return createFont(family)
          })
        ),
      (a, b) => (a.family.toLowerCase() < b.family.toLowerCase() ? -1 : 1)
    )

    return response.json(allFonts)
  } catch (e) {
    console.log(e)
    return response.status(500).send(null)
  }
}
