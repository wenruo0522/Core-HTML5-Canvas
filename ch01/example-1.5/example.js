
let canvas = document.getElementById('canvas')
let readout = document.getElementById('readout')
let context = canvas.getContext('2d')
let spriteSheet = new Image()

//  Functions

function windowToCanvas(canvas, x, y) {
    let bbox = canvas.getBoundingClientRect()

    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    }
}

function drawBackground() {
    const VERTICAL_LINE_SPACING = 12
    let i = context.canvas.height

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = 'lightgray'
    context.lineWidth = 0.5

    while(i > VERTICAL_LINE_SPACING*4) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
        context.stroke()

        i -= VERTICAL_LINE_SPACING
    }
}

function drawSpriteSheet() {
    context.drawImage(spriteSheet, 0, 0)
}

function drawGuidelines(x, y) {
    context.strokeStyle = 'rgba(0, 0, 230, 0.8)'
    context.lineWidth = 0.5
    drawVerticalLine(x)
    drawHorizontalLine(y)
}

function updateReadout(x, y) {
    readout.innerText = `(${x.toFixed(0)},${y.toFixed(0)})`
}

function drawHorizontalLine(y) {
    context.beginPath()
    context.moveTo(0, y + 0.5)
    context.lineTo(context.canvas.width, y + 0.5)
    context.stroke()
}

function drawVerticalLine(x) {
    context.beginPath()
    context.moveTo(x + 0.5, 0)
    context.lineTo(x + 0.5, context.canvas.height)
    context.stroke()
}

//  Event handlers
canvas.onmousemove = function(e) {
    let loc = windowToCanvas(canvas, e.clientX, e.clientY)

    drawBackground()
    drawSpriteSheet()
    drawGuidelines(loc.x, loc.y)
    updateReadout(loc.x, loc.y)
}

//  Initialization
spriteSheet.src = '../../shared/images/running-sprite-sheet.png'
spriteSheet.onload = function(e) {
    drawSpriteSheet()
}

drawBackground()