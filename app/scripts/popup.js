import $ from 'jquery'
import * as app from '../manifest.json'

addVersionNumber()

function addVersionNumber() {
  const versionNumber = app.version
  $('#versionNumber').html(`v${versionNumber}`)
}
