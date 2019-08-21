import $ from 'jquery'
import * as openColor from 'open-color/open-color.json'
import { defaultColors } from './default-colors'
import { rgb2hex } from './utils'

main()

function main() {
  const colors = getColorConfig()
  applyColors(colors)

  observeMutation(colors)
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
  fillColorsInCalendar(colors)
  fillColorsInLegend(colors)
  fillColorsInActivityOverview(colors)
}

function getCalendarContainer() {
  return $('.js-calendar-graph')
}

function getDayRects() {
  return getCalendarContainer().find('rect.day')
}

function fillColorsInCalendar(colors) {
  getDayRects().each(function() {
    const fill = $(this).attr('fill')
    const newFill = colors[defaultColors.indexOf(fill)]
    $(this).attr('fill', newFill)
  })
}

function getLegendContainer() {
  return $('.contrib-legend')
}

function fillColorsInLegend(colors) {
  getLegendContainer()
    .find('li')
    .each(function() {
      const color = rgb2hex($(this).css('background-color'))
      const newColor = colors[defaultColors.indexOf(color)]
      $(this).css('background-color', newColor)
    })
}

function getActivityOverviewContainer() {
  return $('.js-activity-overview-graph-container')
}

function fillColorsInActivityOverview(colors) {
  const container = getActivityOverviewContainer()
  container.find('.js-highlight-blob').each(function() {
    $(this).attr('fill', colors[2])
    $(this).css('stroke', colors[2])
  })

  container.find('.activity-overview-axis ').each(function() {
    $(this).css('stroke', colors[3])
  })

  container.find('.activity-overview-point').each(function() {
    $(this).css('stroke', colors[3])
  })
}

function getContributionsContainer() {
  return $('.js-yearly-contributions')
}

function observeMutation(colors) {
  const mainContainer = $('#js-pjax-container')

  if (mainContainer.length) {
    const observer = new MutationObserver(function() {
      const contributionsContainer = getContributionsContainer()
      if (contributionsContainer.length) {
        applyColors(colors)
      }
    })

    observer.observe(mainContainer[0], { subtree: true, childList: true })
  }
}
