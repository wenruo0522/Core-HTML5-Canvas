
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const eraseAllButton = document.getElementById('eraseAllButton')
const strokeStyleSelect = document.getElementById('strokeStyleSelect')
const startAngleSelect = document.getElementById('startAngleSelect')
const fillStyleSelect = document.getElementById('fillStyleSelect')
const fillCheckbox = document.getElementById('fillCheckbox')
const sidesSelect = document.getElementById('sidesSelect')

let drawingSurfaceImageData
let mousedown = {}
let rubberBandRect = {}
let dragging = false
let sides = 8
let startAngle = 0
let guideWires = true
let Point = function(x, y) {
    this.x = x
    this.y = y
}

//  Functions

function drawGrid(color, stepX, stepY) {
    context.save()

    context.strokeStyle = color
    context.fillStyle = '#ffffff'
    context.lineWidth = 0.5
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    for (let i = stepX + 0.5; i < context.canvas.width; i += stepX) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, context.canvas.height)
        context.stroke()
    }

    for (let i = stepY + 0.5; i < context.canvas.height; i += stepY) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
        context.stroke()
    }

    context.restore()
}

function windowToCanvas(e) {
    let x = e.x || e.clientX
    let y = e.y || e.clientY
    let bbox = canvas.getBoundingClientRect()

    return {
        x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    }
}

//  save and restore drawing surface

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height)
}

function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0)
}

//  RubberBands

function updateRubberBandRectangle(loc) {
    rubberBandRect.width = Math.abs(loc.x - mousedown.x)
    rubberBandRect.height = Math.abs(loc.y - mousedown.y)

    if (loc.x > mousedown.x) {
        rubberBandRect.left = mousedown.x
    } else {
        rubberBandRect.left = loc.x
    }

    if (loc.y > mousedown.y) {
        rubberBandRect.top = mousedown.y
    } else {
        rubberBandRect.top = loc.y
    }
}

function getPolygonPoints(centerX, centerY, radius, sides, startAngle) {
    let points = []
    let angle = startAngle || 0

    for (let i=0; i < sides; ++i) {
        points.push(new Point(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle)))
        angle += 2*Math.PI/sides;
    }

    return points
}

function createPolygonPath(centerX, centerY, radius, sides, startAngle) {
    let points = getPolygonPoints(centerX, centerY, radius, sides, startAngle)

    context.beginPath()

    context.moveTo(points[0].x, points[0].y)

    for (let i=1; i < sides; ++i) {
        context.lineTo(points[i].x, points[i].y)
    }

    context.closePath()
}

function drawRubberBandShape(loc, sides, startAngle) {
    createPolygonPath(mousedown.x, mousedown.y, rubberBandRect.width, parseInt(sidesSelect.value), (Math.PI / 180) * parseInt(startAngleSelect.value))
    context.stroke()

    if (fillCheckbox.checked) {
        context.fill()
    }
}

function updateRubberBand(loc, sides, startAngle) {
    updateRubberBandRectangle(loc)
    drawRubberBandShape(loc, sides, startAngle)
}

//  GuideWires

function drawHorizontalLine(y) {
    context.beginPath()
    context.moveTo(0, y+0.5)
    context.lineTo(context.canvas.width, y+0.5)
    context.stroke()
}

function drawVerticalLine(x) {
    context.beginPath()
    context.moveTo(x+0.5, 0)
    context.lineTo(x+0.5, context.canvas.height)
    context.stroke()
}

function drawGuideWires(x, y) {
    context.save()
    context.strokeStyle = 'rgba(0,0,230,0.4)'
    context.lineWidth = 0.5
    drawVerticalLine(x)
    drawHorizontalLine(y)
    context.restore()
}

//  Event handlers

canvas.onmousedown = function(e) {
    let loc = windowToCanvas(e)

    e.preventDefault() // prevent cursor change

    saveDrawingSurface()
    mousedown.x = loc.x
    mousedown.y = loc.y
    dragging = true
}

canvas.onmousemove = function(e) {
    let loc

    if (dragging) {
        e.preventDefault() // prevent selections

        loc = windowToCanvas(e)
        restoreDrawingSurface()
        updateRubberBand(loc, sides, startAngle)

        if (guideWires) {
            drawGuideWires(mousedown.x, mousedown.y)
        }
    }
}

canvas.onmouseup = function(e) {
    let loc = windowToCanvas(e)
    dragging = false
    restoreDrawingSurface()
    updateRubberBand(loc)
}

eraseAllButton.onclick = function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid('lightgray', 10, 10)
    saveDrawingSurface()
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value
}

fillStyleSelect.onchange = function(e) {
    context.fillStyle = fillStyleSelect.value
}

//  Initialization

context.strokeStyle = strokeStyleSelect.value
context.fillStyle = fillStyleSelect.value
drawGrid('lightgray', 10, 10)