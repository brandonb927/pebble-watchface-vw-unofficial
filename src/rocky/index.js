var rocky = require('rocky')

var monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

// Colours
var logoColor = '#ff0055'
var brandSecondary = '#fff'

var brandFontPrimary = '18px bold Gothic'
var brandFontSecondary = '32px bold numbers Leco-numbers'

// var settings = null

rocky.on('draw', function (event) {
  var ctx = event.context
  var w = ctx.canvas.unobstructedWidth // 144
  var h = ctx.canvas.unobstructedHeight // 168
  var centerY = (h / 2)
  var centerX = (w / 2)
  var uoHeight = function (posX) {
    var obstruction_h = (h - w - 3)
    return (posX - obstruction_h)
  }
  var d = new Date()

  // if (settings) {
  //   logoColor = cssColor(settings.LogoColor)
  // }

  // Reset the view
  ctx.clearRect(0, 0, w, h)

  // LOGO body
  ctx.strokeStyle = logoColor
  ctx.lineWidth = 8
  ctx.beginPath()

  // Top V
  var outerVX = 18
  var outerVY = 68
  var centerVY = 28
  ctx.moveTo((centerX - outerVX), (centerY - outerVY))
  ctx.lineTo(centerX, (centerY - centerVY))
  ctx.lineTo((centerX + outerVX), (centerY - outerVY))

  // Bottom W
  var outerWX = 42
  var outerWY = 46
  var innerWX = 14
  var innerWY = 18
  var centerWY = 16
  ctx.moveTo((centerX - outerWX), (centerY - outerWY))
  ctx.lineTo((centerX - innerWX), (centerY + innerWY))
  ctx.lineTo(centerX, (centerY - centerWY))
  ctx.lineTo((centerX + innerWX), (centerY + innerWY))
  ctx.lineTo((centerX + outerWX), (centerY - outerWY))

  ctx.stroke()
  ctx.closePath()

  ctx.strokeStyle = logoColor
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.arc(centerX, (centerY - 22), 50, 0, (2 * Math.PI), false)
  ctx.stroke()
  ctx.closePath()

  // DATE
  var clockDate = monthNames[d.getMonth()] + ' ' + d.getDate()
  ctx.textAlign = 'center'
  ctx.font = brandFontPrimary
  ctx.fillStyle = brandSecondary
  ctx.fillText(clockDate, centerX, (uoHeight(h) - 30))


  // TIME
  var localeTime = d.toLocaleTimeString().split(' ') // ['12:31:21', 'AM'] or ['00:31:21']
  var clockTime = localeTime[0].split(':').slice(0, 2).join(':') // '12:31' or '00:31'
  ctx.textAlign = 'center'
  ctx.fillStyle = brandSecondary
  ctx.font = brandFontSecondary
  ctx.fillText(clockTime, centerX, (uoHeight(h) - 16))
})

rocky.on('minutechange', function (event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw()
})

// Borrowed from Clay.js

/**
 * @param {string|boolean|number} color
 * @returns {string}
 */
function cssColor(color) {
  if (typeof color === 'number') {
    color = color.toString(16)
  } else if (!color) {
    return 'transparent'
  }

  color = padColorString(color)

  return '#' + color
}

/**
 * @param {string} color
 * @return {string}
 */
function padColorString(color) {
  color = color.toLowerCase()

  while (color.length < 6) {
    color = '0' + color
  }

  return color
}
