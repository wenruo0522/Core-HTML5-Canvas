
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const CENTROID_RADIUS = 10
const CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)'
const CENTROID_FILL_STYLE = 'rgba(80, 190, 240, 0.6)'
const RING_INNER_RADIUS = 35
const RING_OUTER_RADIUS = 55
const ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)'
const ANNOTATIONS_TEXT_SIZE = 12
const TICK_WIDTH = 10
const TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)'
const TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)'
const TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)'
const GUIDEWIRE_STROKE_STYLE = 'goldenrod'
const GUIDEWIRE_FILL_STYLE = 'rgba(250, 250, 0, 0.6)'
const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 150
}

//  Functions

function drawGrid(color, stepX, stepY) {
    context.save()

    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.strokeStyle = color;
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = stepX + 0.5; i < context.canvas.width; i += stepX) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (let i = stepY + 0.5; i < context.canvas.height; i += stepY) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }

    context.restore();
}

function drawDial() {
    let loc = {
        x: circle.x,
        y: circle.y
    }

    drawCentroid()
    drawCentroidGuidewire(loc)

    drawRing()
    drawTickInnerCircle()
    drawTicks()
    drawAnnotations()
}

function drawCentroid() {
    context.beginPath()
    context.save()

    context.strokeStyle = CENTROID_STROKE_STYLE
    context.fillStyle = CENTROID_FILL_STYLE

    context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI*2, false)
    context.stroke()
    context.fill()
    context.restore()
}

function drawCentroidGuidewire(loc) {
    let angle = Math.PI/4
    let radius
    let endPt

    radius = circle.radius + RING_OUTER_RADIUS

    if (loc.x >= circle.x) {
        endPt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        }
    } else {
        endPt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        }
    }

    context.save()

    context.strokeStyle = GUIDEWIRE_STROKE_STYLE
    context.fillStyle = GUIDEWIRE_FILL_STYLE

    context.beginPath()
    context.moveTo(circle.x, circle.y)
    context.lineTo(endPt.x, endPt.y)
    context.stroke()

    context.beginPath()
    context.strokeStyle = TICK_LONG_STROKE_STYLE
    context.arc(endPt.x, endPt.y, 5, 0, Math.PI*2, false)
    context.fill()
    context.stroke()

    context.restore()
}

function drawRing() {
    drawRingOuterCircle()

    context.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, Math.PI*2, false)

    context.fillStyle = 'rgba(100, 140, 230, 0.1)'
    context.fill()
    context.stroke()
}

function drawRingOuterCircle() {
    context.shadowColor = 'rgba(0, 0, 0, 0.7)'
    context.shadowOffsetX = 3
    context.shadowOffsetY = 3
    context.shadowBlur = 6
    context.strokeStyle = TRACKING_DIAL_STROKING_STYLE

    context.beginPath()
    context.arc(circle.x, circle.y, circle.radius + RING_OUTER_RADIUS, 0, Math.PI*2, true)
    context.stroke()
}

function drawTickInnerCircle() {
    context.save()
    context.beginPath()
    context.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS - TICK_WIDTH, 0, Math.PI*2, false)
    context.stroke()
    context.restore()
}

function drawTick(angle, radius, cnt) {
    let tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH/2

    context.beginPath()

    context.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth), circle.y + Math.sin(angle) * (radius - tickWidth))

    context.lineTo(circle.x + Math.cos(angle) * (radius), circle.y + Math.sin(angle) * (radius))

    context.strokeStyle = TICK_SHORT_STROKE_STYLE
    context.stroke()
}

function drawTicks() {
    let radius = circle.radius + RING_INNER_RADIUS
    let ANGLE_MAX = 2*Math.PI
    let ANGLE_DELTA = Math.PI/64
    let tickWidth

    context.save()

    for (let angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
        drawTick(angle, radius, cnt++)
    }

    context.restore();
}

function drawAnnotations() {
    let radius = circle.radius + RING_INNER_RADIUS

    context.save()
    context.fillStyle = ANNOTATIONS_FILL_STYLE
    context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica'

    for (let angle = 0; angle < 2*Math.PI; angle += Math.PI/8) {
        context.beginPath()
        context.fillText((angle * 180 / Math.PI).toFixed(0), circle.x + Math.cos(angle) * (radius - TICK_WIDTH*2), circle.y - Math.sin(angle) * (radius - TICK_WIDTH*2))
    }
    context.restore()
}

//  Initialization

context.shadowOffsetX = 2
context.shadowOffsetY = 2
context.shadowBlur = 4

context.textAlign = 'center'
context.textBaseline = 'middle'
drawGrid('lightgray', 10, 10)
drawDial()




