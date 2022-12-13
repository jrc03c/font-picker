const { capitalize } = require("./utils")
const { createApp } = require("vue")
const createMyFont = require("./create-my-font")
const createVueComponentWithCSS = require("vue-component-with-css")
const FontSettingsComponent = require("./components/font-settings")
const lodash = require("lodash")
const webSafeFonts = require("../api/web-safe-fonts")

window.addEventListener("load", async () => {
  const html = /* html */ `
    <div class="font-picker">
      <div class="font-picker-header">
        <div class="font-picker-header-left">
          <b>Font picker</b>
        </div>

        <div class="font-picker-header-right">
          <button
            :class="isExpanded ? 'font-picker-collapse-button' : 'font-picker-expand-button'"
            @click="isExpanded = !isExpanded">
            {{ isExpanded ? "−" : "+" }}
          </button>

          <button class="font-picker-close-button" @click="close">
            ✕
          </button>
        </div>
      </div>

      <div
        v-if="isExpanded && myFonts && myFonts.length > 0"
        class="font-picker-fonts">
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

  const app = createApp(
    createVueComponentWithCSS({
      components: {
        "font-settings": FontSettingsComponent,
      },

      template: html,

      data() {
        return {
          extraStylesElement: null,
          myFonts: [],
          allFonts,
          isExpanded: true,

          css: /* css */ `
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
              padding: 0;
              background-color: rgb(235, 235, 235);
              border-radius: 4px;
              box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
              min-width: 256px;
              max-height: calc(100vh - 3rem);
              overflow-y: hidden;
            }
        
            .font-picker-header {
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-content: center;
              align-items: center;
              background-color: rgb(51, 51, 51);
              color: white;
              padding: 0.75rem;
              border-radius: 4px 4px 0 0 !important;
              margin-bottom: 4px;
            }
        
            .font-picker-header button {
              color: white;
            }
        
            button.font-picker-collapse-button,
            button.font-picker-expand-button,
            button.font-picker-close-button {
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
        
            button.font-picker-collapse-button:hover,
            button.font-picker-expand-button:hover {
              color: hsl(202.5deg, 100%, 75%);
            }
            
            button.font-picker-close-button:hover {
              color: red;
            }
        
            .font-picker-fonts {
              max-height: calc(calc(100vh - 8rem) - 8px);
              overflow-y: auto;
            }
        
            button.font-picker-add-font-button {
              width: 100%;
              background-color: rgb(51, 51, 51);
              color: white;
              font-weight: bold;
              border: 0 !important;
              border-radius: 0 0 4px 4px !important;
              padding: 0.75rem !important; 
            }
        
            button.font-picker-add-font-button:hover {
              background-color: rgb(61, 61, 61);
            }
        
            button.font-picker-add-font-button:active {
              background-color: rgb(31, 31, 31);
            }

            .font-picker-font {
              margin-bottom: 4px;
            }
        
            .font-picker-font-header {
              padding: 0.75rem;
              background-color: rgb(225, 225, 225);
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-content: center;
              align-items: center;
              cursor: pointer;
            }
        
            .font-picker-font-header.is-expanded {
              border-radius: 4px 4px 0 0 !important;
              cursor: default;
            }
        
            .font-picker-font-body {
              margin-bottom: 4px;
              padding: 1.5rem;
              border-radius: 4px;
              background-color: rgb(245, 245, 245);
            }
        
            button.font-picker-delete-button {
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
          `,
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

        close() {
          app.unmount()
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

      beforeUnmount() {
        const self = this
        document.body.removeChild(container)
        document.body.removeChild(self.extraStylesElement)
      },
    })
  )

  const container = document.createElement("div")
  container.id = "font-picker-container"
  document.body.appendChild(container)
  app.mount(container)
})
