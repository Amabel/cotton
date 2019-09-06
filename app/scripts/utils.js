export function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2)
  }
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
