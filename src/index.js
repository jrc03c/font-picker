const { capitalize } = require("./utils")
const { createApp } = require("vue")
const createMyFont = require("./create-my-font")
const css = require("./css")
const html = require("./html")
const lodash = require("lodash")
const webSafeFonts = require("../api/web-safe-fonts")

window.addEventListener("load", async () => {
  const allFontsCache = localStorage.getItem("all-fonts")

  const allFonts = await (async () => {
    if (allFontsCache) {
      return JSON.parse(allFontsCache)
    } else {
      const response = await fetch("/api/get-all-fonts")
      const allFonts = await response.json()
      localStorage.setItem("all-fonts", JSON.stringify(allFonts))
      return allFonts
    }
  })()

  const app = createApp({
    template: html,

    data() {
      return {
        extraStylesElement: null,
        myFonts: [],
        allFonts,
      }
    },

    methods: {
      addFont() {
        const self = this
        self.myFonts.push(createMyFont(self.allFonts[0]))
        self.updateStyles()
        self.save()
      },

      setFontFamily(font, family) {
        const self = this
        const index = self.myFonts.indexOf(font)
        const oldFont = self.myFonts[index]

        self.myFonts[index] = createMyFont(
          self.allFonts.find(f => f.family === family)
        )

        self.myFonts[index].selectors = oldFont.selectors
        self.updateStyles()
        self.save()
      },

      setFontSelectors(font, selectors) {
        const self = this
        font.selectors = selectors
        self.updateStyles()
        self.save()
      },

      setFontVariant(font, variant) {
        const self = this
        font.variant = variant
        self.updateStyles()
        self.save()
      },

      deleteFont(font) {
        const self = this
        self.myFonts.splice(self.myFonts.indexOf(font), 1)
        self.updateStyles()
        self.save()
      },

      updateStyles: lodash.debounce(function () {
        const self = this

        const faces = self.myFonts
          .map(font => {
            if (webSafeFonts.indexOf(font.family) > -1) {
              return null
            }

            return /* css */ `
              @font-face {
                font-family: "${font.family} ${capitalize(font.variant)}";
                src: url("${font.files[font.variant]}");
              }
            `
          })
          .filter(face => !!face)
          .join("\n")

        const rules = self.myFonts
          .map(font => {
            if (font.selectors.trim().length === 0) {
              return null
            }

            const family = `${font.family} ${capitalize(font.variant)}`

            return /* css */ `
              ${font.selectors} {
                font-family: "${family}" !important;
              }
            `
          })
          .filter(rule => !!rule)
          .join("\n\n")

        self.extraStylesElement.innerHTML = faces + "\n\n" + rules
      }, 500),

      save() {
        const self = this
        localStorage.setItem("my-fonts", JSON.stringify(self.myFonts))
      },
    },

    mounted() {
      const self = this
      const myFonts = localStorage.getItem("my-fonts")

      if (myFonts) {
        self.myFonts = JSON.parse(myFonts)
      } else {
        self.myFonts.push(createMyFont(self.allFonts[0]))
      }

      const extraStylesElement = document.createElement("style")
      document.body.appendChild(extraStylesElement)
      self.extraStylesElement = extraStylesElement
      self.updateStyles()
    },

    unmounted() {
      document.body.removeChild(style)
      document.body.removeChild(container)
      document.body.removeChild(self.extraStylesElement)
    },
  })

  const style = document.createElement("style")
  document.body.appendChild(style)
  style.innerHTML = css

  const container = document.createElement("div")
  container.id = "font-picker-container"
  document.body.appendChild(container)
  app.mount(container)
})
