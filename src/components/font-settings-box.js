const CollapsibleBoxComponent = require("./collapsible-box")
const createVueComponentWithCSS = require("vue-component-with-css")

const css = /* css */ `
  .font-picker-font > .font-picker-collapsible-box-body {
    padding: 0 1.5rem;
    max-width: 100%;
    box-sizing: border-box;
  }

  .font-picker-font.is-expanded > .font-picker-collapsible-box-body {
    padding: 1.5rem;
  }

  .font-picker-font label,
  .font-picker-font input,
  .font-picker-font select,
  .font-picker-font option {
    margin: 0 0 0.75rem 0;
    width: 100%;
    box-sizing: border-box;
  }

  .font-picker-font.is-expanded >
  .font-picker-collapsible-box-body {
    max-height: 290px !important;
  }
`

const template = /* html */ `
  <collapsible-box
    :title="font.family + '(' + font.variant + ')'"
    class="font-picker-font"
    :class="{'is-expanded': isExpanded}"
    @expand="isExpanded = true"
    @collapse="isExpanded = false"
    @close="deleteFont">
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
  </collapsible-box>
`

module.exports = createVueComponentWithCSS({
  components: {
    "collapsible-box": CollapsibleBoxComponent,
  },

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

  template,

  data() {
    return {
      css,
      isExpanded: true,
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
