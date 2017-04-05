var Clay = require('./clay')

var clayConfig = [
  {
    "type": "heading",
    "defaultValue": "Watchface Configuration"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Logo Color"
      },
      {
        "type": "color",
        "messageKey": "logoColor",
        "defaultValue": "0xff0055",
        "label": "Color"
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  },
]

var clay = new Clay(clayConfig, null, { autoHandleEvents: false })

var restoreSettings = function () {
  // Restore settings from localStorage and send to watch
  var settings = JSON.parse(localStorage.getItem('clay-settings'))
  if (settings) {
    Pebble.postMessage(settings)
  }
}

Pebble.addEventListener('showConfiguration', function (e) {
  Pebble.openURL(clay.generateUrl())
})

Pebble.addEventListener('webviewclosed', function (e) {
  if (e && !e.response) {
    return
  }

  // Return settings from Config Page to watch
  var settings = clay.getSettings(e.response, false)

  // Flatten to match localStorage version
  var settingsFlat = {}
  Object.keys(settings).forEach(function (key) {
    if (typeof settings[key] === 'object' && settings[key]) {
      settingsFlat[key] = settings[key].value
    } else {
      settingsFlat[key] = settings[key]
    }
  })

  Pebble.postMessage(settingsFlat)
})

Pebble.on('message', function (event) {
  if (event.data.command === 'settings') {
    restoreSettings()
  }
})
