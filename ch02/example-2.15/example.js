
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const eraseAllButton = document.getElementById('eraseAllButton')
const strokeStyleSelect = document.getElementById('strokeStyleSelect')
const guidewireCheckbox = document.getElementById('guidewireCheckbox')

let drawingSurfaceImageData
let mousedown = {}
let rubberBandRect = {}
let dragging = false
let guideWires = guidewireCheckbox.checked

//  Functions

function drawGrid(color, stepX, stepY) {
    context.save()

    context.strokeStyle = color
    context.lineWidth = 0.5
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

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
        x: x - bbox.left * (canvas.width / bbox.width),
        // x: x - bbox.left - (bbox.width - canvas.width) / 2,
        y: y - bbox.top * (canvas.height / bbox.height)
    }
}

//  Save and restore drawing surface

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

    context.save()
    context.strokeStyle = 'red'
    context.restore()
}

function drawRubberBandShape(loc) {
    context.beginPath()
    context.moveTo(mousedown.x, mousedown.y)
    context.lineTo(loc.x, loc.y)
    context.stroke()
}

function updateRubberBand(loc) {
    updateRubberBandRectangle(loc)
    drawRubberBandShape(loc)
}

//  GuideWires

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

function drawGuideWires(x, y) {
    context.save()
    context.strokeStyle = 'rgba(0, 0, 230, 0.4)'
    context.lineWidth = 0.5
    drawVerticalLine(x)
    drawHorizontalLine(y)
    context.restore()
}

//  Canvas event handlers

canvas.onmousedown = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)

    e.preventDefault()

    saveDrawingSurface()
    mousedown.x = loc.x
    mousedown.y = loc.y
    dragging = true
}

canvas.onmousemove = function(e) {
    let loc

    if (dragging) {
        e.preventDefault()

        loc = windowToCanvas(e.clientX, e.clientY)
        restoreDrawingSurface()
        updateRubberBand(loc)

        if (guideWires) {
            drawGuideWires(loc.x, loc.y)
        }
    }
}

canvas.onmouseup = function(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)
    restoreDrawingSurface()
    updateRubberBand(loc)
    dragging = false
}

//  Controls event handlers

eraseAllButton.onclick = function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid('lightGray', 10, 10)
    saveDrawingSurface()
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value
}

guidewireCheckbox.onchange = function(e) {
    guideWires = guidewireCheckbox.checked
}

//  Initialization

context.strokeStyle = strokeStyleSelect.value
drawGrid('lightGray', 10, 10)

