
const context = document.getElementById('canvas').getContext('2d')

//  Functions

function drawGrid(context, color, stepX, stepY) {

}

// Initialization

drawGrid(context, 'lightGray', 10, 10)

//  Drawing attributes

context.font = '48px Helvetica'
context.strokeStyle = 'blue'
context.fillStyle = 'red'
context.lineWidth = '2'

//  Text

context.strokeText('Stroke', 60, 110)
context.fillText('Fill', 440, 110)

context.strokeText('Stroke & Fill', 650, 110)
context.fillText('Stroke & Fill', 650, 110)

//  Rectangles

context.lineWidth = '5'
context.beginPath()
context.rect(80, 150, 150, 100)
context.stroke()

context.beginPath()
context.rect(400, 150, 150, 100)
context.fill()

context.beginPath()
context.rect(750, 150, 150, 100)
context.stroke()
context.fill()


//  Open arcs

context.beginPath()
context.arc(150, 370, 60, 0, Math.PI*3/2)
context.stroke()

context.beginPath()
context.arc(475, 370, 60, 0, Math.PI*3/2)
context.fill()

context.beginPath()
context.arc(820, 370, 60, 0, Math.PI*3/2)
context.stroke()
context.fill()

//  Closed arcs

context.beginPath()
context.arc(150, 550, 60, 0, Math.PI*3/2)


