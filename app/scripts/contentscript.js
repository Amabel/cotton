import $ from 'jquery'
import { rgb2hex } from './utils'
import * as themes from './theme'

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

function getThemeColors(themeName) {
  const theme = themes[themeName]
  return theme ? theme : themes.github
}

/**
 *
 * @param {*} options
 *            default:    true: update theme based on default theme
 *                        false: update theme based on previous theme
 */
function updateTheme(options = {}) {
  chrome.storage.sync.get(['theme', 'previousTheme'], function(result) {
    const theme = result ? getThemeColors(result.theme) : themes.github
    let previousTheme = result ? getThemeColors(result.previousTheme) : themes.github
    previousTheme = options.default ? themes.github : previousTheme
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
