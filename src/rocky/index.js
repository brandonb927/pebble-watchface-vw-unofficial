var rocky = require('rocky')

var config = require('./config')

var settings = null

function canvasBox (ctx) {
  var w = ctx.canvas.unobstructedWidth // 144
  var h = ctx.canvas.unobstructedHeight // 168

  return {
    w: w,
    h: h,
    centerY: (h / 2),
    centerX: (w / 2),
  }
}

function uoHeight (ctx, posX) {
  var w = canvasBox(ctx).w
  var h = canvasBox(ctx).h
  var obstruction_h = (h - w - 3)
  return (posX - obstruction_h)
}

function drawLogo (ctx, logoColor) {
  var w = canvasBox(ctx).w
  var h = canvasBox(ctx).h
  var centerY = canvasBox(ctx).centerY
  var centerX = canvasBox(ctx).centerX

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

  // The outer circle
  ctx.strokeStyle = logoColor
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.arc(centerX, (centerY - 22), 50, 0, (2 * Math.PI), false)
  ctx.stroke()
  ctx.closePath()
}

function drawTime (ctx) {
  var w = canvasBox(ctx).w
  var h = canvasBox(ctx).h
  var centerY = canvasBox(ctx).centerY
  var centerX = canvasBox(ctx).centerX

  var localeTime = config.date.now.toLocaleTimeString().split(' ') // ['12:31:21', 'AM'] or ['00:31:21']
  var clockTime = localeTime[0].split(':').slice(0, 2).join(':') // '12:31' or '00:31'

  ctx.textAlign = 'center'
  ctx.fillStyle = config.brand.colorSecondary
  ctx.font = config.brand.fontSecondary
  ctx.fillText(clockTime, centerX, (uoHeight(ctx, h) - 16))
}

function drawDate (ctx) {
  var w = canvasBox(ctx).w
  var h = canvasBox(ctx).h
  var centerY = canvasBox(ctx).centerY
  var centerX = canvasBox(ctx).centerX

  var clockDate = config.date.monthNames[config.date.now.getMonth()] + ' ' + config.date.now.getDate()

  ctx.textAlign = 'center'
  ctx.font = config.brand.fontPrimary
  ctx.fillStyle = config.brand.colorSecondary
  ctx.fillText(clockDate, centerX, (uoHeight(ctx, h) - 30))
}

rocky.on('draw', function (event) {
  var ctx = event.context
  var logoColor = settings ? cssColor(settings.logoColor) : config.brand.logoColor

  // Reset the view
  ctx.clearRect(0, 0, canvasBox(ctx).w, canvasBox(ctx).h)

  drawLogo(ctx, logoColor)
  drawDate(ctx)
  drawTime(ctx)
})

rocky.on('minutechange', function (event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw()
})

rocky.on('message', function(event) {
  settings = event.data;
  rocky.requestDraw()
})

rocky.postMessage({
  command: 'settings'
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
