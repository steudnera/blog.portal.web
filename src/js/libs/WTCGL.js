/**
 * WTCGL
 * @auhor unknow
 */

const _createClass = (function () {
    function defineProperties (target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]

            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true

            if ('value' in descriptor) {
                descriptor.writable = true
            }

            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }

        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }

        return Constructor
    }
}())

/**
 * 检查实例的基类
 * @param {*} instance
 * @param {*} _Class
 * @return void
 */
function _classCallCheck (instance, _Class) {
    if (!(instance instanceof _Class)) {
        throw new TypeError('Cannot call a class as a function')
    }
}

var WTCGL = (function () {
    function WTCGL (el, vertexShaderSource, fragmentShaderSource, width, height, pxratio, styleElement) {
        _classCallCheck(this, WTCGL)
        this.run = this.run.bind(this)

        // If the HTML element isn't a canvas, return null
        if (!(el instanceof HTMLElement) || el.nodeName.toLowerCase() !== 'canvas') {
            return null
        }

        this._el = el
        // The context should be either webgl2, webgl or experimental-webgl
        this._ctx = this._el.getContext('webgl2', this.webgl_params) || this._el.getContext('webgl', this.webgl_params) || this._el.getContext('experimental-webgl', this.webgl_params)

        // Set up the extensions
        this._ctx.getExtension('OES_standard_derivatives')
        this._ctx.getExtension('EXT_shader_texture_lod')

        if (!this._ctx) {
            return null
        }

        // Create the shaders
        this._vertexShader = WTCGL.createShaderOfType(this._ctx, this._ctx.VERTEX_SHADER, vertexShaderSource)
        this._fragmentShader = WTCGL.createShaderOfType(this._ctx, this._ctx.FRAGMENT_SHADER, fragmentShaderSource)

        // Create the program and link the shaders
        this._program = this._ctx.createProgram()
        this._ctx.attachShader(this._program, this._vertexShader)
        this._ctx.attachShader(this._program, this._fragmentShader)
        this._ctx.linkProgram(this._program)

        // means the shaders have failed for some reason
        if (!this._ctx.getProgramParameter(this._program, this._ctx.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this._ctx.getProgramInfoLog(this._program))
            return null
        }

        // Initialise the vertex buffers
        this.initBuffers([-1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0])
        this._programInfo = {
            attribs: {
                vertexPosition: this._ctx.getAttribLocation(this._program, 'a_position')
            },
            uniforms: {
                projectionMatrix: this._ctx.getUniformLocation(this._program, 'u_projectionMatrix'),
                modelViewMatrix: this._ctx.getUniformLocation(this._program, 'u_modelViewMatrix'),
                resolution: this._ctx.getUniformLocation(this._program, 'u_resolution'),
                time: this._ctx.getUniformLocation(this._program, 'u_time')
            }
        }

        this._ctx.useProgram(this._program)
        this.pxratio = pxratio
        this.styleElement = styleElement !== true
        this.resize(width, height)
    }

    _createClass(WTCGL, [{
        key: 'resize',
        value: function resize (w, h) {
            this._el.width = w * this.pxratio
            this._el.height = h * this.pxratio
            this._size = [w * this.pxratio, h * this.pxratio]

            if (this.styleElement) {
                this._el.style.width = w + 'px'
                this._el.style.height = h + 'px'
            }

            this._ctx.viewportWidth = w * this.pxratio
            this._ctx.viewportHeight = h * this.pxratio

            this._ctx.uniform2fv(this._programInfo.uniforms.resolution, this._size)
            this.initBuffers(this._positions)
        }
    }, {
        key: 'initBuffers',
        value: function initBuffers (positions) {
            this._positions = positions
            this._positionBuffer = this._ctx.createBuffer()

            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, this._positionBuffer)
            this._ctx.bufferData(this._ctx.ARRAY_BUFFER, new Float32Array(positions), this._ctx.STATIC_DRAW)
        }
    }, {
        key: 'addUniform',
        value: function addUniform (name, type, value) {
            var uniform = this._programInfo.uniforms[name]
            uniform = this._ctx.getUniformLocation(this._program, 'u_' + name)
            switch (type) {
            case WTCGL.TYPE_FLOAT:
                if (!isNaN(value)) {
                    this._ctx.uniform1f(uniform, value)
                }
                break
            case WTCGL.TYPE_V2:
                if (value instanceof Array && value.length === 2.0) {
                    this._ctx.uniform2fv(uniform, value)
                }
                break
            case WTCGL.TYPE_V3:
                if (value instanceof Array && value.length === 3.0) {
                    this._ctx.uniform3fv(uniform, value)
                }
                break
            case WTCGL.TYPE_V4:
                if (value instanceof Array && value.length === 4.0) {
                    this._ctx.uniform4fv(uniform, value)
                }
                break
            }

            this._programInfo.uniforms[name] = uniform
            return uniform
        }
    }, {
        key: 'run',
        value: function run (delta) {
            this.running && requestAnimationFrame(this.run)
            this.time = this.startTime + delta * 0.0002
            this.render()
        }
    }, {
        key: 'render',
        value: function render () {
            // Update the time uniform
            this._ctx.uniform1f(this._programInfo.uniforms.time, this.time)
            this._ctx.viewport(0, 0, this._ctx.viewportWidth, this._ctx.viewportHeight)

            if (this.clearing) {
                this._ctx.clearColor(1.0, 0.0, 0.0, 0.0)
                this._ctx.clearDepth(1.0)
                this._ctx.enable(this._ctx.DEPTH_TEST)
                this._ctx.depthFunc(this._ctx.LEQUAL)
                this._ctx.blendFunc(this._ctx.SRC_ALPHA, this._ctx.ONE_MINUS_SRC_ALPHA)

                this._ctx.clear(this._ctx.COLOR_BUFFER_BIT)
            }

            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, this._positionBuffer)
            this._ctx.vertexAttribPointer(this._programInfo.attribs.vertexPosition, 3, this._ctx.FLOAT, false, 0, 0)
            this._ctx.enableVertexAttribArray(this._programInfo.attribs.vertexPosition)

            // Set the shader uniforms
            this.includePerspectiveMatrix && this._ctx.uniformMatrix4fv(this._programInfo.uniforms.projectionMatrix, false, this.perspectiveMatrix)
            this.includeModelViewMatrix && this._ctx.uniformMatrix4fv(this._programInfo.uniforms.modelViewMatrix, false, this.modelViewMatrix)

            this._ctx.drawArrays(this._ctx.TRIANGLE_STRIP, 0, 4)
        }
    }, {
        key: 'webgl_params',
        get: function get () {
            return {
                alpha: true
            }
        }
    }, {
        key: 'styleElement',
        set: function set (value) {
            this._styleElement = value === true
            if (this._styleElement === false && this._el) {
                this._el.style.width = ''
                this._el.style.height = ''
            }
        },
        get: function get () {
            return this._styleElement !== false
        }
    }, {
        key: 'startTime',
        set: function set (value) {
            if (!isNaN(value)) {
                this._startTime = value
            }
        },
        get: function get () {
            return this._startTime || 0
        }
    }, {
        key: 'time',
        set: function set (value) {
            if (!isNaN(value)) {
                this._time = value
            }
        },
        get: function get () {
            return this._time || 0
        }
    }, {
        key: 'includePerspectiveMatrix',
        set: function set (value) {
            this._includePerspectiveMatrix = value === true
        },
        get: function get () {
            return this._includePerspectiveMatrix === true
        }
    }, {
        key: 'includeModelViewMatrix',
        set: function set (value) {
            this._includeModelViewMatrix = value === true
        },
        get: function get () {
            return this._includeModelViewMatrix === true
        }
    }, {
        key: 'clearing',
        set: function set (value) {
            this._clearing = value === true
        },
        get: function get () {
            return this._clearing === true
        }
    }, {
        key: 'running',
        set: function set (value) {
            !this.running && value === true && requestAnimationFrame(this.run)
            this._running = value === true
        },
        get: function get () {
            return this._running === true
        }
    }, {
        key: 'pxratio',
        set: function set (value) {
            if (value > 0) this._pxratio = value
        },
        get: function get () {
            return this._pxratio || 1
        }
    }, {
        key: 'perspectiveMatrix',
        get: function get () {
            var fieldOfView = 45 * Math.PI / 180 // in radians
            var aspect = this._size.w / this._size.h
            var zNear = 0.1
            var zFar = 100.0
            var projectionMatrix = mat4.create()
            // note: glmatrix.js always has the first argument
            // as the destination to receive the result.
            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

            return projectionMatrix
        }
    }, {
        key: 'modelViewMatrix',
        get: function get () {
            // Set the drawing position to the 'identity' point, which is
            // the center of the scene.
            var modelViewMatrix = mat4.create()

            // Now move the drawing position a bit to where we want to
            // start drawing the square.
            // destination matrix
            // matrix to translate
            // amount to translate
            mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -1.0])
            return modelViewMatrix
        }
    }], [{
        key: 'createShaderOfType',
        value: function createShaderOfType (ctx, type, source) {
            var shader = ctx.createShader(type)
            ctx.shaderSource(shader, source)
            ctx.compileShader(shader)

            if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
                ctx.deleteShader(shader)
                return null
            }

            return shader
        }
    }])

    return WTCGL
}())

WTCGL.TYPE_INT = 0
WTCGL.TYPE_FLOAT = 1
WTCGL.TYPE_V2 = 2
WTCGL.TYPE_V3 = 3
WTCGL.TYPE_V4 = 4

WTCGL.IMAGETYPE_REGULAR = 0
WTCGL.IMAGETYPE_TILE = 1
WTCGL.IMAGETYPE_MIRROR = 2

export default WTCGL
