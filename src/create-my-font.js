module.exports = function createMyFont(font) {
  return {
    family: font.family,
    files: font.files,
    variants: font.variants,
    variant: font.variants[0] || "regular",
    selectors: "",
  }
}
