module.exports = /* html */ `
  <div class="font-picker">
    <div v-if="myFonts && myFonts.length > 0" class="font-picker-fonts">
      <div v-for="myFont in myFonts" class="font-picker-font">
        <button
          class="font-picker-delete-button"
          @click="deleteFont(myFont)">
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
            @input="setFontVariant(myFont, $event.target.value)"
            :value="myFont.variant || myFont.variants[0]">
            <option v-for="variant in myFont.variants" :value="variant">
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
            :value="myFont.selectors"
            @input="setFontSelectors(myFont, $event.target.value)"
            placeholder="h1, .some-class, #some-id">
        </div>
      </div>
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
