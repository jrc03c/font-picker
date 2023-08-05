// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  #font-picker-container *,
  #font-picker-container button,
  #font-picker-container input,
  #font-picker-container select,
  #font-picker-container option {
    font-family: monospace !important;
  }

  #font-picker-container button,
  #font-picker-container input,
  #font-picker-container select,
  #font-picker-container option {
    font-size: 0.85rem !important;
    border-radius: 4px;
    border: 2px solid gray;
    padding: 0.375rem;
    max-width: 100%;
    box-sizing: border-box;
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
    max-height: calc(100vh - 3rem);
    overflow-y: hidden;
    width: 384px;
  }

  .font-picker-error-notification {
    padding: 1.5rem;
    background-color: hsl(0deg, 100%, 95%);
    color: hsl(0deg, 100%, 40%);
    border-radius: 4px;
    max-width: 256px;
    border: 2px solid hsl(0deg, 100%, 40%);
  }

  .font-picker-error-notification a {
    color: red;
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

  .font-picker > .font-picker-collapsible-box-header button {
    color: white;
  }

  .font-picker-fonts {
    max-height: calc(calc(100vh - 8rem) - 8px);
    overflow-y: auto;
    padding-top: 4px;
    padding-bottom: 4px;
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

  .font-picker > .font-picker-collapsible-box-header {
    background-color: rgb(51, 51, 51);
    color: white;
  }

  .font-settings-box {
    margin-bottom: 4px;
  }

  .font-settings-box:last-child {
    margin-bottom: 0;
  }

  .font-picker.is-expanded >
  .font-picker-collapsible-box-body {
    max-height: 100vh;
  }

  @media (max-width: 320px) {
    #font-picker-container {
      bottom: 0;
      right: 0;
    }

    .font-picker >
    .font-picker-collapsible-box-body {
      max-width: 100vw;
    }

    .font-picker.is-expanded >
    .font-picker-collapsible-box-body {
      max-width: 100vw;
    }
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="font-picker-error-notification" v-if="error">
    <div><b>Font picker error:</b></div>
    <br>
    <div>{{ error }} Click <a href="">here</a> to start over.</div>
  </div>

  <x-collapsible-box
    :class="{ 'is-expanded': isExpanded }"
    :is-expanded="isExpanded"
    @close="close"
    @collapse="isExpanded = false"
    @expand="isExpanded = true"
    class="font-picker"
    title="Font picker"
    v-else>
    <div class="font-picker-fonts">
      <x-font-settings-box
        :all-fonts="allFonts"
        :font="font"
        :is-expanded="font.isExpanded"
        :key="font.family"
        @collapse="font.isExpanded = false"
        @delete-font="deleteFont"
        @expand="font.isExpanded = true"
        @set-font-family="setFontFamily"
        @set-font-selectors="setFontSelectors"
        @set-font-variant="setFontVariant"
        class="font-settings-box"
        v-for="font in myFonts">
      </x-font-settings-box>
    </div>

    <div class="font-picker-add-font-button-container">
      <button
        @click="addFont"
        class="font-picker-add-font-button">
        Add font
      </button>
    </div>
  </x-collapsible-box>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const { capitalize } = require("./utils")
const { copy } = require("@jrc03c/js-math-tools")
const { createApp } = require("vue")
const CollapsibleBoxComponent = require("./components/collapsible-box")
const createMyFont = require("./create-my-font")
const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const FontSettingsBoxComponent = require("./components/font-settings-box")
const lodash = require("lodash")

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

window.addEventListener("load", async () => {
  if (typeof GOOGLE_WEBFONTS_API_KEY === "undefined") {
    throw new Error(
      "You must define GOOGLE_WEBFONTS_API_KEY for the font picker to work!"
    )
  }

  const webSafeFonts = [
    "Arial",
    "Brush Script MT",
    "Courier New",
    "Garamond",
    "Georgia",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ]

  const app = createApp(
    createVueComponentWithCSS({
      template,

      components: {
        "x-collapsible-box": CollapsibleBoxComponent,
        "x-font-settings-box": FontSettingsBoxComponent,
      },

      data() {
        return {
          allFonts: [],
          css,
          error: "",
          extraStylesElement: null,
          isExpanded: false,
          myFonts: [],
        }
      },

      methods: {
        addFont() {
          const newFont = createMyFont(this.allFonts[0])
          newFont.isExpanded = true
          this.myFonts.push(newFont)
          this.updateStyles()
          this.save()
        },

        close() {
          app.unmount()
        },

        deleteFont(font) {
          const index = this.myFonts.indexOf(font)
          this.myFonts.splice(index, 1)
          this.updateStyles()
          this.save()
        },

        save() {
          localStorage.setItem("my-fonts", JSON.stringify(this.myFonts))
        },

        setFontFamily(data) {
          const { font, family } = data
          const index = this.myFonts.indexOf(font)
          const oldFont = this.myFonts[index]
          const oldSelectors = copy(oldFont.selectors)

          const newFont = createMyFont(
            this.allFonts.find(f => f.family === family)
          )

          newFont.isExpanded = true
          newFont.selectors = oldSelectors
          this.myFonts[index] = newFont
          this.updateStyles()
          this.save()
        },

        setFontSelectors(data) {
          const { font, selectors } = data
          font.selectors = selectors
          this.updateStyles()
          this.save()
        },

        setFontVariant(data) {
          const { font, variant } = data
          font.variant = variant
          this.updateStyles()
          this.save()
        },

        updateStyles: lodash.debounce(function () {
          const faces = this.myFonts
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

          const rules = this.myFonts
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

          this.extraStylesElement.innerHTML = faces + "\n\n" + rules
        }, 500),
      },

      async mounted() {
        const allFontsCache = localStorage.getItem("all-fonts")

        if (allFontsCache) {
          this.allFonts = JSON.parse(allFontsCache)
        } else {
          const response = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_WEBFONTS_API_KEY}`
          )

          const fontData = await response.json()

          if (response.status !== 200 || !fontData) {
            localStorage.clear()

            this.error =
              "An error occurred while trying to fetch the list of fonts from Google! Maybe your API key is invalid?"

            return
          }

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

          localStorage.setItem("all-fonts", JSON.stringify(allFonts))
          this.allFonts = allFonts
        }

        this.myFonts = (() => {
          const myFonts = localStorage.getItem("my-fonts")

          if (myFonts) {
            return JSON.parse(myFonts)
          } else {
            return [createMyFont(this.allFonts[0])]
          }
        })()

        this.isExpanded = false
        this.myFonts.forEach(f => (f.isExpanded = false))

        const extraStylesElement = document.createElement("style")
        document.body.appendChild(extraStylesElement)
        this.extraStylesElement = extraStylesElement
        this.updateStyles()
      },

      beforeUnmount() {
        document.body.removeChild(container)
        document.body.removeChild(this.extraStylesElement)
      },
    })
  )

  const container = document.createElement("div")
  container.id = "font-picker-container"
  document.body.appendChild(container)
  app.mount(container)
})
