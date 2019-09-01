import $ from 'jquery'
import * as app from '../manifest.json'
import * as openColor from 'open-color/open-color.json'
import { capitalizeFirstLetter } from './utils'
import * as themes from './theme'

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
  addResetActionListener()
}

function addResetActionListener() {
  $('#reset').click(function() {
    resetTheme()
  })
}

function addRandomizeActionListener() {
  $('#random').click(function() {
    randomizeTheme()
  })
}

function resetTheme() {
  setTheme('default')
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
    const themeName = result.theme
    const colors = themes[themeName] ? themes[themeName] : themes.github

    let div = ''
    colors.forEach(function(c) {
      div += `<div class="square" style="background-color: ${c}"></div>`
    })

    callback(div, themeName)
  })
}

function setTheme(theme) {
  chrome.storage.sync.get('theme', function(result) {
    const previousTheme = result.theme ? result.theme : 'DEFAULT_THEME'
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
