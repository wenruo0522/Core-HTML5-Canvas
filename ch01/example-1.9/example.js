
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const rubberBandDiv = document.getElementById('rubberBandDiv')
const resetButton = document.getElementById('resetButton')
let image = new Image()
let mousedown = {}
let rubberBandRectangle = {}
let dragging = false

//  Functions
function rubberBandStart(x, y) {
    mousedown.x = x
    mousedown.y = y

    rubberBandRectangle.left = mousedown.x
    rubberBandRectangle.top = mousedown.y

    moveRubberBandDiv()
    showRubberBandDiv()

    dragging = true
}

function rubberBandStretch(x, y) {
    rubberBandRectangle.left = x < mousedown.x ? x : mousedown.x
    rubberBandRectangle.top = y < mousedown.y ? y : mousedown.y

    rubberBandRectangle.width = Math.abs(x - mousedown.x)
    rubberBandRectangle.height = Math.abs(y - mousedown.y)

    moveRubberBandDiv()
    resizeRubberBandDiv()
}

function rubberBandEnd() {
    let bbox = canvas.getBoundingClientRect()

    try {
        context.drawImage(canvas, rubberBandRectangle.left - bbox.left, rubberBandRectangle.top - bbox.top,
            rubberBandRectangle.width, rubberBandRectangle.height, 0, 0, canvas.width, canvas.height)
    } catch(e) {
        //  Suppress error message when mouse is released
        //  outside the canvas
    }

    resetRubberBandRectangle()

    rubberBandDiv.style.width = '0'
    rubberBandDiv.style.height = '0'

    hideRubberBandDiv()
    dragging = false
}

function moveRubberBandDiv() {
    rubberBandDiv.style.top = rubberBandRectangle.top + 'px'
    rubberBandDiv.style.left = rubberBandRectangle.left + 'px'
}

function resizeRubberBandDiv() {
    rubberBandDiv.style.width = rubberBandRectangle.width + 'px'
    rubberBandDiv.style.height = rubberBandRectangle.height + 'px'
}

function showRubberBandDiv() {
    rubberBandDiv.style.display = 'inline'
}

function hideRubberBandDiv() {
    rubberBandDiv.style.display = 'none'
}

function resetRubberBandRectangle() {
    rubberBandRectangle = { top: 0, left: 0, width: 0, height: 0 }
}

//  Event handlers
canvas.onmousedown = function(e) {
    let x = e.clientX
    let y = e.clientY

    e.preventDefault()
    rubberBandStart(x, y)
}

window.onmousemove = function(e) {
    let x = e.clientX
    let y = e.clientY

    e.preventDefault()
    if (dragging) {
        rubberBandStretch(x, y)
    }
}

window.onmouseup = function(e) {
    e.preventDefault()
    rubberBandEnd()
}

image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
}

resetButton.onclick = function(e) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.width)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
}

//  Initialization
image.src = '../../shared/images/arch.png'







