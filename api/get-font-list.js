const fetch = require("node-fetch")
const process = require("process")

module.exports = async (request, response) => {
  try {
    const innerResponse = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_WEBFONTS_API_KEY}`
    )

    const fontData = await innerResponse.json()
    return response.send(fontData)
  } catch (e) {
    return response.status(500).send(null)
  }
}
