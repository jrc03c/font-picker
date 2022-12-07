const { createApp } = require("vue")
const lodash = require("lodash")

function createFont() {
  return {
    family: "IBM Plex Sans",
    selectors: "",
    variants: [],
    selectedVariant: null,
  }
}

function sort(x, fn) {
  if (!fn) {
    fn = (a, b) => (a < b ? -1 : 1)
  }

  const out = x.slice()
  out.sort(fn)
  return out
}

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

  const app = createApp({
    template: /* html */ `
      <div class="font-picker">
        <div v-for="myFont in myFonts" class="font-picker-font">
          <button class="font-picker-delete-button" @click="deleteFont(myFont)">
            ✕
          </button>

          <label class="font-picker-font-family-label">
            Family:
          </label>

          <div class="font-picker-font-family-select-container">
            <select
              class="font-picker-font-family-select"
              @input="setFontFamily(myFont, $event.target.value)"
              :value="myFont.family">
              <option v-for="font in sortedFonts" :value="font.family">
                {{ font.family }}
              </option>
            </select>
          </div>

          <label class="font-picker-font-selectors-label">
            Selectors:
          </label>

          <div class="font-picker-font-selectors-input-container">
            <input
              class="font-picker-font-selectors-input"
              type="text"
              :value="myFont.selectors"
              @input="setFontSelectors(myFont, $event.target.value)"
              placeholder="h1, .some-class, #some-id">
          </div>
        </div>

        <br>

        <button @click="addFont">Add font</button>
      </div>
    `,

    data() {
      return {
        extraStylesElement: null,
        myFonts: [],
        fontData,
        sortedFonts: [],
      }
    },

    methods: {
      addFont() {
        const self = this
        self.myFonts.push(createFont())
        self.updateStyles()
        self.save()
      },

      setFontFamily(font, family) {
        const self = this
        font.family = family
        self.updateStyles()
        self.save()
      },

      setFontSelectors: lodash.debounce(function (font, selectors) {
        const self = this
        font.selectors = selectors
        self.updateStyles()
        self.save()
      }, 500),

      deleteFont(font) {
        const self = this
        self.myFonts.splice(self.myFonts.indexOf(font), 1)
        self.updateStyles()
        self.save()
      },

      updateStyles() {
        const self = this

        let interval = setInterval(() => {
          if (
            !self.fontData ||
            !self.fontData.items ||
            !self.fontData.items.find
          ) {
            return
          }

          clearInterval(interval)

          const importStatements = self.myFonts
            .map(font => {
              const itemData = self.fontData.items.find(
                other => other.family === font.family
              )

              return Object.keys(itemData.files)
                .map(
                  file =>
                    `@font-face { font-family: "${font.family}"; src: url("${itemData.files[file]}"); }`
                )
                .join("\n")
            })
            .join("\n")

          const rules = self.myFonts
            .map(font => {
              return font.selectors.trim().length === 0
                ? null
                : `${font.selectors} { font-family: "${font.family}" !important; }`
            })
            .filter(rule => !!rule)
            .join("\n")

          self.extraStylesElement.innerHTML = importStatements + "\n" + rules
        }, 10)
      },

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
        self.myFonts.push(createFont())
      }

      self.sortedFonts = self.fontData.items.map(item => {
        const out = createFont()
        out.family = item.family
        out.variants = item.variants.slice()
        return out
      })

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

  style.innerHTML = /* css */ `
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

    #font-picker-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 1.5rem;
      background-color: rgb(235, 235, 235);
      border-radius: 4px;
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
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

    label.font-picker-font-family-label,
    label.font-picker-font-selectors-label {
      display: block;
      margin-bottom: 0.375rem;
    }
    
    .font-picker-font-family-select-container {
      margin-bottom: 0.75rem;
    }

    input.font-picker-font-selectors-input {
      width: 100%;
      box-sizing: border-box;
    }
  `

  const container = document.createElement("div")
  container.id = "font-picker-container"
  document.body.appendChild(container)
  app.mount(container)
})
