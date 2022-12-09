module.exports = {
  capitalize(x) {
    let out = x.toString()
    return out[0].toUpperCase() + out.substring(1)
  },
}
