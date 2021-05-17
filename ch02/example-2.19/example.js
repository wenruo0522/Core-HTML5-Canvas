
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const eraseAllButton = document.getElementById('eraseAllButton')
const strokeStyleSelect = document.getElementById('strokeStyleSelect')
const fillStyleSelect = document.getElementById('fillStyleSelect')
const lineWidthSelect = document.getElementById('lineWidthSelect')
const fillCheckbox = document.getElementById('fillCheckbox')
const guidewireCheckbox = document.getElementById('guidewireCheckbox')

let drawingSurfaceImageData
let mousedown = {}
let rubberBandRect = {}
let dragging = false
let guideWires = true

//  General-purpose functions

function drawGrid(color, stepX, stepY) {
    context.save()

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

function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect()

    return {
        x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    }
}

//  save and restore drawing surface

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
}

function drawRubberBandShape(loc) {
    let angle
    let radius

    if (mousedown.y === loc.y) {
        radius = Math.abs(loc.x - mousedown.x)
    } else {
        angle = Math.atan(rubberBandRect.height/rubberBandRect.width)
        radius = rubberBandRect.height / Math.sin(angle)
    }

    context.beginPath()

}