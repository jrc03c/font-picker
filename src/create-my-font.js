const { copy } = require("@jrc03c/js-math-tools")

module.exports = function createMyFont(font) {
  font = copy(font)

  return {
    family: font.family,
    files: font.files,
    isExpanded: false,
    variants: font.variants,
    variant: font.variants[0] || "regular",
    selectors: "",
  }
}
