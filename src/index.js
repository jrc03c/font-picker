window.addEventListener("load", async () => {
  const cachedFontData = localStorage.getItem("font-data")

  const fontData = await (async () => {
    if (cachedFontData) {
      return JSON.parse(cachedFontData)
    } else {
      const response = await fetch("/api/get-font-list")
      const fontData = await response.json()
      localStorage.setItem("font-data", JSON.stringify(fontData))
      return fontData
    }
  })()

  console.log(fontData)
})
