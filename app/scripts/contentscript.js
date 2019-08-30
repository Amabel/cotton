import $ from 'jquery'
import * as openColor from 'open-color/open-color.json'
import { defaultTheme } from './default-colors'
import { rgb2hex } from './utils'
import { COLORS_INDEX } from './constants'

main()

function main() {
  updateTheme({ default: true })

  addMessageListener()
  observeMutation()
}

function addMessageListener() {
  chrome.runtime.onMessage.addListener(() => {
    updateTheme()
  })
}

function getThemeColors(theme) {
  // Index range: 0 ~ 9
  // See more on https://yeun.github.io/open-color/
  const colorsIndex = COLORS_INDEX
  const colors = openColor.default[theme]
  // Trim colors based on index
  return [
    colors[colorsIndex[0]],
    colors[colorsIndex[1]],
    colors[colorsIndex[2]],
    colors[colorsIndex[3]],
    colors[colorsIndex[4]],
  ]
}

/**
 *
 * @param {*} options
 *            default:    true: update theme based on default theme
 *                        false: update theme based on previous theme
 */
function updateTheme(options = {}) {
  chrome.storage.sync.get(['theme', 'previousTheme'], function(result) {
    const theme = result ? getThemeColors(result.theme) : defaultTheme
    let previousTheme = result ? getThemeColors(result.previousTheme) : defaultTheme
    previousTheme = options.default ? defaultTheme : previousTheme
    applyTheme(theme, previousTheme)
  })
}

function applyTheme(theme, previousTheme) {
  fillColorsInCalendar(theme, previousTheme)
  fillColorsInLegend(theme, previousTheme)
  fillColorsInActivityOverview(theme)
}

function getCalendarContainer() {
  return $('.js-calendar-graph')
}

function getDayRects() {
  return getCalendarContainer().find('rect.day')
}

function fillColorsInCalendar(colors, previousTheme) {
  getDayRects().each(function() {
    const fill = $(this).attr('fill')
    const newFill = colors[previousTheme.indexOf(fill)]
    $(this).attr('fill', newFill)
  })
}

function getLegendContainer() {
  return $('.contrib-legend')
}

function fillColorsInLegend(colors, previousTheme) {
  getLegendContainer()
    .find('li')
    .each(function() {
      const color = rgb2hex($(this).css('background-color'))
      const newColor = colors[previousTheme.indexOf(color)]
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

function observeMutation() {
  const mainContainer = $('#js-pjax-container')

  if (mainContainer.length) {
    const observer = new MutationObserver(function() {
      const contributionsContainer = getContributionsContainer()
      if (contributionsContainer.length) {
        updateTheme({ default: true })
      }
    })

    observer.observe(mainContainer[0], { subtree: true, childList: true })
  }
}
