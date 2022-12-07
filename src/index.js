const { createApp } = require("vue")

function createFont() {
  return {
    family: "Arial",
    weight: 400,
    selectors: [],
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
        <div v-for="myFont in fonts" class="font-picker-font">
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
              placeholder="h1, .some-class, #some-id">
          </div>
        </div>

        <br>

        <button @click="addFont">Add font</button>
      </div>
    `,

    data() {
      return {
        fonts: [],
        fontData,

        webSafeFonts: [
          "Helvetica",
          "Arial",
          "Arial Black",
          "Verdana",
          "Tahoma",
          "Trebuchet MS",
          "Impact",
          "Gill Sans",
          "Times New Roman",
          "Georgia",
          "Palatino",
          "Baskerville",
          "Andalé Mono",
          "Courier",
          "Lucida",
          "Monaco",
          "Bradley Hand",
          "Brush Script MT",
          "Luminari",
          "Comic Sans MS",
        ],
      }
    },

    computed: {
      sortedFonts() {
        const self = this

        return sort(
          self.fontData.items.concat(
            self.webSafeFonts.map(font => {
              const out = createFont()
              out.family = font
              return out
            })
          ),
          (a, b) => (a.family < b.family ? -1 : 1)
        )
      },
    },

    methods: {
      addFont() {
        const self = this
        self.fonts.push(createFont())
        self.save()
      },

      setFontFamily(font, family) {
        const self = this
        font.family = family
        self.save()
      },

      deleteFont(font) {
        const self = this
        self.fonts.splice(self.fonts.indexOf(font), 1)
        self.save()
      },

      save() {
        const self = this
        localStorage.setItem("my-fonts", JSON.stringify(self.fonts))
      },
    },

    mounted() {
      const self = this
      const myFonts = localStorage.getItem("my-fonts")

      if (myFonts) {
        self.fonts = JSON.parse(myFonts)
      } else {
        self.fonts.push(createFont())
      }
    },

    unmounted() {
      document.body.removeChild(style)
      document.body.removeChild(container)
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
      font-family: monospace;
      font-size: 0.85rem;
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
