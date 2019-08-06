/**
 * 能量球
 * @author unknow
 */

import WTCGL from './libs/WTCGL'

const mousepos = [0, 0]
const twodWebGL = new WTCGL(document.querySelector('canvas#webgl'), document.querySelector('script#vertexShader').textContent, document.querySelector('script#fragmentShader').textContent, window.innerWidth, window.innerHeight, 2)

window.addEventListener('resize', function () {
    twodWebGL.resize(window.innerWidth, window.innerHeight)
})

twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos)

window.addEventListener('pointermove', function (e) {
    var ratio = window.innerHeight / window.innerWidth
    if (window.innerHeight > window.innerWidth) {
        mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth
        mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1 * ratio
    } else {
        mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio
        mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1
    }

    twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos)
})

twodWebGL.running = true
