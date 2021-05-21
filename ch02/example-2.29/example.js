
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const eraseAllButton = document.getElementById('eraseAllButton')
const strokeStyleSelect = document.getElementById('strokeStyleSelect')
const guidewireCheckbox = document.getElementById('guidewireCheckbox')
const instructions = document.getElementById('instructions')
const instructionsOkayButton = document.getElementById('instructionsOkayButton')
const instructionsNoMoreButton = document.getElementById('instructionsNoMoreButton')
const GRID_STROKE_STYLE= 'lightblue'
const GRID_SPACING = 10
const CONTROL_POINT_RADIUS = 5
const CONTROL_POINT_STROKE_STYLE = 'blue'
const CONTROL_POINT_FILL_STYLE = 'rgba(255, 255, 0, 0.5)'
const END_POINT_STROKE_STYLE = 'navy'
const END_POINT_FILL_STYLE = 'rgba(0, 255, 0, 0.5)'
const GUIDEWIRE_STROKE_STYLE = 'rgba(0,0,230,0.4)'

let showInstructions = true
let drawingImageData
let mousedown = {}
let rubberBandRect = {}
let dragging = false
let draggingPoint = false
let endPoints = [ {}, {} ]
let controlPoints = [ {}, {} ]
let editing = false
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
        x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    }
}

//  save and restore drawing surface

function saveDrawingSurface() {
    drawingImageData = context.getImageData(0, 0, canvas.width, canvas.height)
}

function restoreDrawingSurface() {
    context.putImageData(drawingImageData, 0, 0)
}

//  RubberBands

function updateRubberBandRectangle(loc) {
    rubberBandRect.width  = Math.abs(loc.x - mousedown.x)
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

function drawBezierCurve() {
    context.beginPath()
    context.moveTo(endPoints[0].x, endPoints[0].y)
    context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[1].x, endPoints[1].y)
    context.stroke()
}

function updateEndAndControlPoints() {
    endPoints[0].x = rubberBandRect.left
    endPoints[0].y = rubberBandRect.top

    endPoints[1].x = rubberBandRect.left + rubberBandRect.width
    endPoints[1].y = rubberBandRect.top  + rubberBandRect.height

    controlPoints[0].x = rubberBandRect.left
    controlPoints[0].y = rubberBandRect.top  + rubberBandRect.height

    controlPoints[1].x = rubberBandRect.left + rubberBandRect.width
    controlPoints[1].y = rubberBandRect.top
}

function drawRubberBandShape(loc) {
    updateEndAndControlPoints()
    drawBezierCurve()
}

function updateRubberBand(loc) {
    updateRubberbandRectangle(loc)
    drawRubberBandShape(loc)
}

//  GuideWires

function drawHorizontalGuidewire(y) {
    context.beginPath()
    context.moveTo(0, y + 0.5)
    context.lineTo(context.canvas.width, y + 0.5)
    context.stroke()
}

function drawVerticalGuidewire(x) {
    context.beginPath()
    context.moveTo(x + 0.5, 0)
    context.lineTo(x + 0.5, context.canvas.height)
    context.stroke()
}

function drawGuideWires(x, y) {
    context.save()
    context.strokeStyle = GUIDEWIRE_STROKE_STYLE
    context.lineWidth = 0.5
    drawVerticalGuidewire(x)
    drawHorizontalGuidewire(y)
    context.restore()
}

//  End points and control points

function drawControlPoint(index) {
    context.beginPath()
    context.arc(controlPoints[index].x, controlPoints[index].y,
        CONTROL_POINT_RADIUS, 0, Math.PI*2, false)
    context.stroke()
    context.fill()
}

function drawControlPoints() {
    context.save()
    context.strokeStyle = CONTROL_POINT_STROKE_STYLE
    context.fillStyle = CONTROL_POINT_FILL_STYLE

    drawControlPoint(0)
    drawControlPoint(1)

    context.stroke()
    context.fill()
    context.restore()
}

function drawEndPoint(index) {
    context.beginPath()
    context.arc(endPoints[index].x, endPoints[index].y,
        CONTROL_POINT_RADIUS, 0, Math.PI*2, false)
    context.stroke()
    context.fill()
}

function drawEndPoints() {
    context.save()
    context.strokeStyle = END_POINT_STROKE_STYLE
    context.fillStyle = END_POINT_FILL_STYLE

    drawEndPoint(0)
    drawEndPoint(1)

    context.stroke()
    context.fill()
    context.restore()
}

function drawControlAndEndPoints() {
    drawControlPoints()
    drawEndPoints()
}

function cursorInEndPoint(loc) {
    let pt

    endPoints.forEach( (point) => {
        context.beginPath()
        context.arc(point.x, point.y,
            CONTROL_POINT_RADIUS, 0, Math.PI*2, false)

        if (context.isPointInPath(loc.x, loc.y)) {
            pt = point
        }
    })

    return pt
}



