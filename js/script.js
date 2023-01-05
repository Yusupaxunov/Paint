const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImage = document.querySelector('.save-img')


let ctext = canvas.getContext('2d'),
    isActive = false,
    brushWidth = 5,
    selectedTool = 'brush',
    previusMouseX,
    previusMouseY,
    snapshot,
    selectedColor = '#000'

const setCanvasBackground = () => {
    ctext.fillStyle = '#fff'
    ctext.fillRect(0, 0, canvas.width, canvas.height)
    ctext.fillStyle = selectedColor
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

const startDraw = (e) => {
    isActive = true
    previusMouseX = e.offsetX
    previusMouseY = e.offsetY   
    ctext.beginPath()
    ctext.lineWidth = brushWidth
    ctext.strokeStyle = selectedColor
    ctext.fillStyle = selectedColor 
    snapshot = ctext.getImageData(0, 0, canvas.width, canvas.height)
}

const drawRectangle = (e) => {
    fillColor.checked 
    ? ctext.fillRect(e.offsetX, e.offsetY, previusMouseX - e.offsetX, previusMouseY - e.offsetY)
    : ctext.strokeRect(e.offsetX, e.offsetY, previusMouseX - e.offsetX, previusMouseY - e.offsetY)

}

const drawCircle = (e) => {
    ctext.beginPath()
    const radius = 
        Math.sqrt(Math.pow(previusMouseX - e.offsetX, 2)) + Math.pow(previusMouseY - e.offsetY, 2)
    ctext.arc(previusMouseX, previusMouseY, radius, 0 , 2 * Math.PI)
    fillColor.checked ? ctext.fill() : ctext.stroke()
}

const drawTriangle = (e) => {
    ctext.beginPath()
    ctext.moveTo(previusMouseX, previusMouseY)
    ctext.lineTo(e.offsetX, e.offsetY)
    ctext.lineTo(previusMouseX * 2 - e.offsetX, e.offsetY)
    ctext.closePath()
    fillColor.checked ? ctext.fill() : ctext.stroke()
}

const drawing = (e) =>{
    if (!isActive) return
    ctext.putImageData(snapshot, 0, 0)

    if (selectedTool == 'brush' || selectedTool == 'eraser') {
        ctext.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor
        ctext.lineTo(e.offsetX, e.offsetY)
        ctext.stroke()  
    }
     
    switch (selectedTool) {
        case 'rectangle':
            drawRectangle(e)
            break;
        case 'circle':
            drawCircle(e)
            break;
        case 'triangle':
            drawTriangle(e)
            break;
        default:
            break;
    }
    
}

const stopDraw = () => {
    isActive = false
}

toolBtns.forEach( btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(`selected tool ${selectedTool}`);
    })
})

sizeSlider.addEventListener('change', () => {
    brushWidth = sizeSlider.value
})

colorBtns.forEach( btns => {
    btns.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btns.classList.add('selected')
        const bgColors = window.getComputedStyle(btns).getPropertyValue('background-color')
        selectedColor = bgColors
    })
});

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener('click', () => {
    ctext.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
})

saveImage.addEventListener('click', () => {
    const link = document.createElement('a')
    link.download= `Yusupaxunov-Paint${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDraw);