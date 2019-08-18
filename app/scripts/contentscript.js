import $ from 'jquery'
import * as openColor from 'open-color/open-color.json'
import { defaultColors } from './default-colors'

main()

function main() {
  const colors = getColorConfig()
  applyColors(colors)
}

function getColorConfig() {
  // Index range: 0 ~ 9
  // See more on https://yeun.github.io/open-color/
  const colorsIndex = [0, 2, 5, 7, 9]
  const colors = openColor.blue
  // Trim colors based on index
  return [
    colors[colorsIndex[0]],
    colors[colorsIndex[1]],
    colors[colorsIndex[2]],
    colors[colorsIndex[3]],
    colors[colorsIndex[4]],
  ]
}

function applyColors(colors) {
  fillColorInCalendar(colors)
}

function getCalendarContainer() {
  return $('.js-calendar-graph')
}

function getDayRects() {
  return getCalendarContainer().find('rect.day')
}

function fillColorInCalendar(colors) {
  getDayRects().each(function() {
    const fill = $(this).attr('fill')
    const newFill = colors[defaultColors.indexOf(fill)]
    $(this).attr('fill', newFill)
  })
}
