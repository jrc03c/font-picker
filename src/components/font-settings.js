module.exports = {
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
    <div class="font-picker-font">
      <div class="font-picker-font-header" :class="{'is-expanded': isExpanded}">
        <div class="font-picker-font-header-left">
          {{ font.family }} ({{ font.variant }})
        </div>

        <div class="font-picker-font-header-right">
          <button
            :class="isExpanded ? 'font-picker-collapse-button' : 'font-picker-expand-button'"
            @click="isExpanded = !isExpanded">
            {{ isExpanded ? "−" : "+" }}
          </button>

          <button
            class="font-picker-delete-button"
            @click="deleteFont(font)">
            ✕
          </button>
        </div>
      </div>

      <div v-if="isExpanded" class="font-picker-font-body">
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
}
