
const context = document.getElementById('canvas').getContext('2d')

//  Functions

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

//  Initialization

drawGrid(context, 'lightGray', 10, 10)