
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
let draggingOffsetX
let draggingOffsetY
let sides = 8
let startAngle = 0
let guideWires = true
let polygons = []
let tmpPolygon = new Polygon(0, 0, 1, 4, 0, 'blue', 'red', false)

//  Functions

function drawGrid(color, stepX, stepY) {
    context.save()

    context.shadowColor = undefined
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0

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

function windowToCanvas(x, y) {
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

function drawRubberBandShape(loc, sides, startAngle) {
    let polygon = new Polygon(mousedown.x, mousedown.y, rubberBandRect.width, parseInt(sidesSelect.value),
        (Math.PI / 180) * parseInt(startAngleSelect.value), context.strokeStyle, context.fillStyle, fillCheckbox.checked)

    context.beginPath()
    polygon.createPath(context)
    polygon.stroke(context)

    if (fillCheckbox.checked) {
        polygon.fill(context)
    }

    if (!dragging) {
        polygons.push(polygon)
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

function drawPolygons() {
    polygons.forEach( function(polygon) {
        polygon.stroke(context)
        if (polygon.filled) {
            polygon.fill(context)
        }
    })
}

function startDragging(loc) {
    saveDrawingSurface()
    mousedown.x = loc.x
    mousedown.y = loc.y
}

//  Event handlers

canvas.onmousedown = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    e.preventDefault() // prevent cursor change

    startDragging(loc)
    dragging = true
}

canvas.onmousemove = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    e.preventDefault() // prevent selections

    if (dragging) {
        restoreDrawingSurface()
        updateRubberBand(loc, sides, startAngle)

        if (guideWires) {
            drawGuideWires(mousedown.x, mousedown.y)
        }
    }
}

canvas.onmouseup = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

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

context.shadowOffsetX = 2
context.shadowOffsetY = 2
context.shadowBlur = 4

drawGrid('lightgray', 10, 10)
