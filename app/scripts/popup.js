import $ from 'jquery'
import * as app from '../manifest.json'
import * as openColor from 'open-color/open-color.json'
import { COLORS_INDEX } from './constants'
import { capitalizeFirstLetter } from './utils'

setup()
addVersionNumber()
addThemeDiv()

addActionListeners()

function setup() {
  delete openColor.default.black
  delete openColor.default.white
}

function addActionListeners() {
  addRandomizeActionListener()
}

function addRandomizeActionListener() {
  $('#random').click(function() {
    randomizeTheme()
  })
}

function randomizeTheme() {
  chrome.storage.sync.get('theme', function(result) {
    const currentTheme = result.theme
    let theme = null

    // Prevent the same theme
    do {
      theme = getRandomTheme()
    } while (theme === currentTheme)

    setTheme(theme)
  })
}

function getRandomTheme() {
  const themes = Object.keys(openColor.default)
  return themes[(themes.length * Math.random()) << 0]
}

function addThemeDiv() {
  const cb = function(div, themeName) {
    $('#currentTheme').html(div)
    $('#themeName').html(capitalizeFirstLetter(themeName))
  }
  formThemeDiv(cb)
}

function formThemeDiv(callback) {
  chrome.storage.sync.get('theme', function(result) {
    const theme = result.theme
    const colorsIndex = COLORS_INDEX
    const colors = openColor.default[theme]

    const trimedColors = [
      colors[colorsIndex[0]],
      colors[colorsIndex[1]],
      colors[colorsIndex[2]],
      colors[colorsIndex[3]],
      colors[colorsIndex[4]],
    ]

    let div = ''
    trimedColors.forEach(function(c) {
      div += `<div class="square" style="background-color: ${c}"></div>`
    })

    callback(div, theme)
  })
}

function setTheme(theme) {
  chrome.storage.sync.get('theme', function(result) {
    const previousTheme = result.theme ? result.theme : 'defaultTheme'
    chrome.storage.sync.set({ theme, previousTheme }, function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { from: 'cotton', type: 'updateTheme', theme })
      })

      addThemeDiv()
    })
  })
}

function addVersionNumber() {
  const versionNumber = app.version
  $('#versionNumber').html(`v${versionNumber}`)
}
