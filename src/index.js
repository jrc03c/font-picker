const { capitalize } = require("./utils")
const { createApp } = require("vue")
const createMyFont = require("./create-my-font")
const FontSettingsComponent = require("./components/font-settings")
const lodash = require("lodash")
const webSafeFonts = require("../api/web-safe-fonts")

window.addEventListener("load", async () => {
  const css = /* css */ `
    #font-picker-container *,
    #font-picker-container button,
    #font-picker-container input,
    #font-picker-container select,
    #font-picker-container option {
      font-family: monospace !important;
      font-size: 0.85rem !important;
      border-radius: 4px;
    }

    #font-picker-container button,
    #font-picker-container input,
    #font-picker-container select,
    #font-picker-container option {
      border: 2px solid gray;
      padding: 0.375rem;
    }

    #font-picker-container button,
    #font-picker-container select,
    #font-picker-container option {
      cursor: pointer;
    }

    #font-picker-container label {
      display: block;
      margin-bottom: 0.375rem;
    }

    #font-picker-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 1.5rem;
      background-color: rgb(235, 235, 235);
      border-radius: 4px;
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
    }

    .font-picker-fonts {
      margin-bottom: 1.5rem;
    }

    .font-picker-font {
      margin-bottom: 4px;
      padding: 1.5rem;
      border-radius: 4px;
      background-color: rgb(245, 245, 245);
      position: relative;
    }

    button.font-picker-delete-button {
      position: absolute;
      top: calc(0.375rem * 0.85);
      right: calc(0.375rem * 0.85);
      margin: 0;
      padding: 0;
      border: 0 !important;
      border-radius: 100% !important;
      width: calc(1.5rem * 0.85);
      min-width: calc(1.5rem * 0.85);
      max-width: calc(1.5rem * 0.85);
      height: calc(1.5rem * 0.85);
      min-height: calc(1.5rem * 0.85);
      max-height: calc(1.5rem * 0.85);
      background-color: transparent;
      cursor: pointer;
      display: inline-flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: center;
      align-items: center;
      font-size: calc(1rem / 0.85) !important;
    }

    button.font-picker-delete-button:hover {
      color: red;
    }

    .font-picker-font-family-select-container,
    .font-picker-font-variants-select-container {
      margin-bottom: 0.75rem;
    }

    input.font-picker-font-selectors-input {
      width: 100%;
      box-sizing: border-box;
    }

    .font-picker-add-font-button-container {
      text-align: right;
    }
  `

  const html = /* html */ `
    <div class="font-picker">
      <div v-if="myFonts && myFonts.length > 0" class="font-picker-fonts">
        <font-settings
          v-for="font in myFonts"
          :all-fonts="allFonts"
          :font="font"
          @delete-font="deleteFont"
          @set-font-family="setFontFamily"
          @set-font-variant="setFontVariant"
          @set-font-selectors="setFontSelectors">
        </font-settings>
      </div>

      <div class="font-picker-add-font-button-container">
        <button
          class="font-picker-add-font-button"
          @click="addFont">
          Add font
        </button>
      </div>
    </div>
  `

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
    components: {
      "font-settings": FontSettingsComponent,
    },

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

      setFontFamily(data) {
        const self = this
        const { font, family } = data
        const index = self.myFonts.indexOf(font)
        const oldFont = self.myFonts[index]

        self.myFonts[index] = createMyFont(
          self.allFonts.find(f => f.family === family)
        )

        self.myFonts[index].selectors = oldFont.selectors
        self.updateStyles()
        self.save()
      },

      setFontSelectors(data) {
        const self = this
        const { font, selectors } = data
        font.selectors = selectors
        self.updateStyles()
        self.save()
      },

      setFontVariant(data) {
        const self = this
        const { font, variant } = data
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
