
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const endPoints = [
    { x: 130, y: 70 },
    { x: 430, y: 270 }
]
const controlPoints = [
    { x: 130, y: 250 },
    { x: 450, y: 70 }
]

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

function drawBezierCurve() {
    context.strokeStyle = 'blue'
    context.fillStyle = 'yellow'

    context.beginPath()
    context.moveTo(endPoints[0].x, endPoints[0].y)
    context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[1].x, endPoints[1].y)
    context.stroke()
}

function drawEndPoints() {
    context.strokeStyle = 'blue'
    context.fillStyle = 'red'

    endPoints.forEach( (point) => {
        context.beginPath()
        context.arc(point.x, point.y, 5, 0, Math.PI*2, false)
        context.stroke()
        context.fill()
    })
}

function drawControlPoints() {
    context.strokeStyle = 'yellow'
    context.fillStyle = 'blue'

    controlPoints.forEach( (point) => {
        context.beginPath()
        context.arc(point.x, point.y, 5, 0, Math.PI*2, false)
        context.stroke()
        context.fill()
    })
}

drawGrid('lightgray', 10, 10)

drawControlPoints()
drawEndPoints()
drawBezierCurve()
