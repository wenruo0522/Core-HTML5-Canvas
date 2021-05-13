const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const AXIS_MARGIN = 40
const AXIS_ORIGIN = { x: AXIS_MARGIN, y: canvas.height - AXIS_MARGIN }
const AXIS_TOP = AXIS_MARGIN
const AXIS_RIGHT = canvas.width - AXIS_MARGIN
const HORIZONTAL_TICK_SPACING = 10
const VERTICAL_TICK_SPACING = 10
const AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x
const AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP
const NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING
const NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING
const TICK_WIDTH = 10
const TICKS_LINEWIDTH = 0.5
const TICKS_COLOR = 'navy'
const AXIS_LINEWIDTH = 1.0
const AXIS_COLOR = 'blue'

//  Functions

function drawGrid(color, stepX, stepY) {
    context.save()

    context.fillStyle = 'white'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    context.lineWidth = 0.5
    context.strokeStyle = color

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

function drawAxes() {
    context.save()
    context.strokeStyle = AXIS_COLOR
    context.lineWidth = AXIS_LINEWIDTH

    drawHorizontalAxis()
    drawVerticalAxis()

    context.lineWidth = 0.5
    context.lineWidth = TICKS_LINEWIDTH
    context.strokeStyle = TICKS_COLOR

    drawVerticalAxisTicks()
    drawHorizontalAxisTicks()

    context.restore()
}

function drawHorizontalAxis() {
    context.beginPath()
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y)
    context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y)
    context.stroke()
}

function drawVerticalAxis() {
    context.beginPath()
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y)
    context.lineTo(AXIS_ORIGIN.x, AXIS_TOP)
    context.stroke()
}

function drawVerticalAxisTicks() {
    let deltaX

    for (let i = 1; i < NUM_VERTICAL_TICKS; ++i) {
        context.beginPath()

        if (i % 5 === 0) {
            deltaX = TICK_WIDTH
        } else {
            deltaX = TICK_WIDTH / 2
        }
        context.moveTo(AXIS_ORIGIN.x - deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING)
        context.lineTo(AXIS_ORIGIN.x + deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING)
        context.stroke()
    }
}

function drawHorizontalAxisTicks() {
    let deltaY

    for (let i = 1; i < NUM_HORIZONTAL_TICKS; ++i) {
        context.beginPath()

        if (i % 5 === 0) {
            deltaY = TICK_WIDTH
        } else {
            deltaY = TICK_WIDTH / 2
        }
        context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y - deltaY)
        context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y + deltaY)

        context.stroke()
    }
}

//  Initialization

drawGrid('lightGray', 10, 10)
drawAxes()