// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-collapsible-box
    :class="{ 'is-expanded': isExpanded }"
    :is-expanded="isExpanded"
    :title="font.family + ' (' + font.variant + ')'"
    @close="deleteFont"
    @collapse="$emit('collapse')"
    @expand="$emit('expand')"
    class="font-picker-font">
    <label class="font-picker-font-family-label">
      Family:
    </label>

    <div class="font-picker-font-family-select-container">
      <select
        :value="font.family"
        @input="setFontFamily(font, $event.target.value)"
        @mousedown="shouldPopulateFontFamilyList = true"
        class="font-picker-font-family-select">
        <option v-if="font && !shouldPopulateFontFamilyList">
          {{ font.family }}
        </option>
        <option
          :key="font-family"
          :value="font.family"
          v-for="font in allFonts"
          v-if="shouldPopulateFontFamilyList">
          {{ font.family }}
        </option>
      </select>
    </div>

    <label class="font-picker-font-variants-label">
      Variant:
    </label>

    <div class="font-picker-font-variants-select-container">
      <select
        :value="font.variant || font.variants[0]"
        @input="setFontVariant(font, $event.target.value)"
        class="font-picker-font-variants-select">
        <option
          :key="variant"
          :value="variant"
          v-for="variant in font.variants">
          {{ variant }}
        </option>
      </select>
    </div>

    <label class="font-picker-font-selectors-label">
      Selectors:
    </label>

    <div class="font-picker-font-selectors-input-container">
      <input
        :value="font.selectors"
        @input="
          $emit(
            'set-font-selectors',
            { font: font, selectors: $event.target.value }
          )
        "
        class="font-picker-font-selectors-input"
        placeholder="h1, .some-class, #some-id"
        type="text">
    </div>
  </x-collapsible-box>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const CollapsibleBoxComponent = require("./collapsible-box")
const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

module.exports = createVueComponentWithCSS({
  name: "x-font-settings-box",
  template,

  emits: [
    "delete-font",
    "set-font-family",
    "set-font-selectors",
    "set-font-variant",
  ],

  components: {
    "x-collapsible-box": CollapsibleBoxComponent,
  },

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

    "is-expanded": {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },

  data() {
    return {
      css,
      shouldPopulateFontFamilyList: false,
    }
  },

  methods: {
    deleteFont(font) {
      this.$emit("delete-font", font)
    },

    setFontFamily(font, family) {
      this.$emit("set-font-family", { font, family })
    },

    setFontSelectors(font, selectors) {
      this.$emit("set-font-selectors", { font, selectors })
    },

    setFontVariant(font, variant) {
      this.$emit("set-font-variant", { font, variant })
    },
  },
})
