
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const repeatRadio = document.getElementById('repeatRadio')
const noRepeatRadio = document.getElementById('noRepeatRadio')
const repeatXRadio = document.getElementById('repeatXRadio')
const repeatYRadio = document.getElementById('repeatYRadio')
let image = new Image()

//  Functions

function fillCanvasWithPattern(repeatString) {
    let pattern = context.createPattern(image, repeatString)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = pattern
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fill()
}

//  Event handlers

repeatRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat')
}

repeatXRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat-x')
}

repeatYRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat-y')
}

noRepeatRadio.onclick = function(e) {
    fillCanvasWithPattern('no-repeat')
}

//  Initialization

image.src = '../../shared/images/redball.png'
image.onload = function(e) {
    fillCanvasWithPattern('repeat')
}


