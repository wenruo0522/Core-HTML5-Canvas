let context = document.getElementById('canvas').getContext('2d')
let startButton = document.getElementById('startButton')
let glassPane = document.getElementById('glassPane')
let paused = true
let circles = []

drawGrid(context, 'lightGray', 10, 10)

context.lineWidth = 0.5
context.font = '32px Arial'

for (let i = 0; i < 100; i++) {
    circles[i] = {
        x: 100,
        y: 100,
        velocityX: 3 * Math.random(),
        velocityY: 3 * Math.random(),
        radius: 50 * Math.random(),
        color:`rgba(${(Math.random()*255).toFixed(0)}, ${(Math.random()*255).toFixed(0)}, ${(Math.random()*255).toFixed(0)}, 1.0)`
    }
}


startButton.onclick = function(e) {
    e.preventDefault()
    e.stopPropagation()

    paused = !paused
    startButton.innerText = paused ? 'start' : 'pause'
}

glassPane.onmousedown = function(e) {
    e.preventDefault()
    e.stopPropagation()
}

context.canvas.onmousedown = function(e) {
    e.preventDefault()
    e.stopPropagation()
}

setInterval(() => {
    if (!paused) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        drawGrid(context, 'lightgray', 10, 10)

        circles.forEach(circle => {
            context.beginPath()
            context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, false)
            context.fillStyle = circle.color
            context.fill()
            adjustPosition(circle)
        })
    }
}, 1000 / 60)


function adjustPosition(circle) {
    if (circle.x + circle.velocityX + circle.radius > context.canvas.width || circle.x + circle.velocityX - circle.radius < 0) {
        circle.velocityX = - circle.velocityX
    }

    if (circle.y + circle.velocityY + circle.radius > context.canvas.height || circle.y + circle.velocityY - circle.radius < 0) {
        circle.velocityY = - circle.velocityY
    }

    circle.x += circle.velocityX
    circle.y += circle.velocityY
}

function drawGrid(context, color, stepX, stepY) {
    context.strokeStyle = color
    context.lineWidth = 0.5

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
}