const createVueComponentWithCSS = require("vue-component-with-css")

module.exports = createVueComponentWithCSS({
  name: "font-settings",

  emits: [
    "delete-font",
    "set-font-family",
    "set-font-variant",
    "set-font-selectors",
  ],

  props: {
    "all-fonts": {
      type: Array,
      required: true,
      default: () => [],
    },

    font: {
      type: Object,
      required: true,
      default: () => null,
    },
  },

  template: /* html */ `
    <div class="font-picker-font" :class="{'is-expanded': isExpanded}">
      <div
        class="font-picker-font-header"
        @click="!isExpanded ? isExpanded = true : () => {}">
        <div class="font-picker-font-header-left">
          {{ font.family }} ({{ font.variant }})
        </div>

        <div class="font-picker-font-header-right">
          <button
            :class="isExpanded ? 'font-picker-collapse-button' : 'font-picker-expand-button'"
            @click.stop="isExpanded = !isExpanded">
            {{ isExpanded ? "−" : "+" }}
          </button>

          <button
            class="font-picker-delete-button"
            @click.stop="deleteFont(font)">
            ✕
          </button>
        </div>
      </div>

      <div class="font-picker-font-body">
        <label class="font-picker-font-family-label">
          Family:
        </label>

        <div class="font-picker-font-family-select-container">
          <select
            class="font-picker-font-family-select"
            @input="setFontFamily(font, $event.target.value)"
            :value="font.family">
            <option v-for="font in allFonts" :value="font.family">
              {{ font.family }}
            </option>
          </select>
        </div>

        <label class="font-picker-font-variants-label">
          Variant:
        </label>

        <div class="font-picker-font-variants-select-container">
          <select
            class="font-picker-font-variants-select"
            @input="setFontVariant(font, $event.target.value)"
            :value="font.variant || font.variants[0]">
            <option v-for="variant in font.variants" :value="variant">
              {{ variant }}
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
            :value="font.selectors"
            @input="$emit('set-font-selectors', {font: font, selectors: $event.target.value})"
            placeholder="h1, .some-class, #some-id">
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      isExpanded: true,

      css: /* css */ `
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
    
        .font-picker-font.is-expanded .font-picker-font-header {
          border-radius: 4px 4px 0 0 !important;
          cursor: default;
        }
    
        .font-picker-font-body {
          margin-bottom: 4px;
          padding: 1.5rem;
          border-radius: 4px;
          background-color: rgb(245, 245, 245);
          max-height: 0;
          overflow: hidden;
          padding-top: 0;
          padding-bottom: 0;
          transition:
            max-height 0.5s ease-in-out,
            padding-top 0.5s ease-in-out,
            padding-bottom 0.5s ease-in-out;
        }

        .font-picker-font.is-expanded .font-picker-font-body {
          max-height: 290px;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          transition:
            max-height 0.5s ease-in-out,
            padding-top 0.5s ease-in-out,
            padding-bottom 0.5s ease-in-out;
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
    deleteFont(font) {
      const self = this
      self.$emit("delete-font", font)
    },

    setFontFamily(font, family) {
      const self = this
      self.$emit("set-font-family", { font, family })
    },

    setFontVariant(font, variant) {
      const self = this
      self.$emit("set-font-variant", { font, variant })
    },

    setFontSelectors(font, selectors) {
      const self = this
      self.$emit("set-font-selectors", { font, selectors })
    },
  },
})
