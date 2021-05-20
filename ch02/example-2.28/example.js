
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const eraseAllButton = document.getElementById('eraseAllButton')
const strokeStyleSelect = document.getElementById('strokeStyleSelect')
const startAngleSelect = document.getElementById('startAngleSelect')
const fillStyleSelect = document.getElementById('fillStyleSelect')
const fillCheckbox = document.getElementById('fillCheckbox')
const editCheckbox = document.getElementById('editCheckbox')
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
let editing = false
let polygons = []

//  Function

function drawGrid(color, stepX, stepY) {
    context.save()

    context.shadowColor = undefined
    context.shadowBlur = 0
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0

    context.strokeStyle = color
    context.fillStyle = '#ffffff'
    context.lineWidth = 0.5
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    context.beginPath()

    for (let i = stepX + 0.5; i < context.canvas.width; i += stepX) {
        context.moveTo(i, 0)
        context.lineTo(i, context.canvas.height)
    }
    context.stroke()

    context.beginPath()

    for (let i = stepY + 0.5; i < context.canvas.height; i += stepY) {
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
    }
    context.stroke()

    context.restore()
}

function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect()
    return {
        x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    }
}

//  save and restore Drawing surface

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height)
}

function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0)
}

//  Draw a polygon

function drawPolygon(polygon) {
    context.beginPath()
    polygon.createPath(context)
    polygon.stroke(context)

    if (fillCheckbox.checked) {
        polygon.fill(context)
    }
}

//  RubberBands

function updateRubberBandRectangle(loc) {
    rubberBandRect.width = Math.abs(loc.x - mousedown.x);
    rubberBandRect.height = Math.abs(loc.y - mousedown.y);

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
    drawPolygon(polygon)

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
    polygons.forEach( polygon => {
        drawPolygon(polygon)
    })
}

//  Drawing

function startDragging(loc) {
    saveDrawingSurface()
    mousedown.x = loc.x
    mousedown.y = loc.y
}

function startEditing() {
    canvas.style.cursor = 'pointer'
    editing = true
}

function stopEditing() {
    canvas.style.cursor = 'crosshair'
    editing = false
}

//  Event handlers

canvas.onmousedown = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    e.preventDefault() // prevent cursor change

    if (editing) {
        polygons.forEach( function (polygon) {
            polygon.createPath(context)
            if (context.isPointInPath(loc.x, loc.y)) {
                startDragging(loc)
                dragging = polygon
                draggingOffsetX = loc.x - polygon.x
                draggingOffsetY = loc.y - polygon.y
                return
            }
        })
    }
    else {
        startDragging(loc)
        dragging = true
    }
}

canvas.onmousemove = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    e.preventDefault() // prevent selections

    if (editing && dragging) {
        dragging.x = loc.x - draggingOffsetX
        dragging.y = loc.y - draggingOffsetY

        context.clearRect(0, 0, canvas.width, canvas.height)
        drawGrid('lightgray', 10, 10)
        drawPolygons()
    }
    else {
        if (dragging) {
            restoreDrawingSurface()
            updateRubberBand(loc, sides, startAngle)

            if (guideWires) {
                drawGuidewires(mousedown.x, mousedown.y)
            }
        }
    }
}

canvas.onmouseup = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    dragging = false

    if (editing) {
    }
    else {
        restoreDrawingSurface()
        updateRubberBand(loc)
    }
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

editCheckbox.onchange = function(e) {
    if (editCheckbox.checked) {
        startEditing()
    }
    else {
        stopEditing()
    }
}

//  Initialization

context.strokeStyle = strokeStyleSelect.value
context.fillStyle = fillStyleSelect.value

drawGrid('lightgray', 10, 10)

if (navigator.userAgent.indexOf('Opera') === -1) {
    context.shadowColor = 'rgba(0, 0, 0, 0.4)'
}

context.shadowOffsetX = 2
context.shadowOffsetY = 2
context.shadowBlur = 4