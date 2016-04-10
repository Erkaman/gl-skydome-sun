'use strict'

var mat4 = require('gl-mat4')
var CreateSphere = require('primitive-sphere')
var Geometry = require('gl-geometry')
var glShader = require('gl-shader')
var glslify = require('glslify')
var createStack = require('gl-state')

module.exports = createSkydome

function Skydome (gl) {

    var sphere = CreateSphere(1, {segments: 50} );

    sphere = Geometry(gl)
        .attr('aPosition', sphere.positions)
        .faces(sphere.cells)

    var program = glShader(gl, glslify('./skydome.vert'), glslify('./skydome.frag'))

    var stack = createStack(gl, [
        gl.DEPTH_TEST,
        gl.DEPTH_WRITEMASK,
        gl.CULL_FACE_MODE,
        gl.CULL_FACE
    ])

    this.constructViewProjection = function(camera) {
        // Remove translation from the view matrix.
        var view = new Float32Array(camera.view)
        mat4.invert(view, view)
        view[12] = view[13] = view[14] = 0.0
        mat4.invert(view, view)

        // Set the projection near/far to 0.1/10.
        var projection = new Float32Array(camera.projection)
        projection[10] = -1.0202020406723022
        projection[14] = -0.20202019810676575

        return {
            view: view,
            projection: projection
        }

    }

    this.draw = function (camera, opts) {

        opts = opts || {}

        var lowerColor = opts.lowerColor || [0.76, 0.76, 0.87]
        var upperColor =  opts.upperColor || [0.26, 0.47, 0.83]
        var sunDirection = opts.sunDirection || [0.71, 0.71, 0]
        var sunColor =  opts.sunColor || [0.8,0.4,0.0]
        var sunSize =  opts.sunSize || 20.0
        var renderSun = (typeof opts.renderSun !== 'undefined' ) ?  opts.renderSun  : true



        // Store the gl state.
        stack.push()

        // Enable front face culling.
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.FRONT)

        // Disble depth test & write.
        gl.disable(gl.DEPTH_TEST)
        gl.depthMask(false)


        var vp = this.constructViewProjection(camera);

        var view = vp.view;
        var projection = vp.projection;


        // Render the skydome.
        program.bind()
        sphere.bind(program)
        program.uniforms.uView = view
        program.uniforms.uProjection = projection

        program.uniforms.uLowerColor = lowerColor
        program.uniforms.uUpperColor =  upperColor
        program.uniforms.uSunDirection = sunDirection
        program.uniforms.uSunColor =  sunColor
        program.uniforms.uSunSize = sunSize
        program.uniforms.uRenderSun = renderSun ? 1.0 : 0.0


        sphere.draw()

        // Restore the gl state.
        stack.pop()
    }
}

function createSkydome (gl) {
    return new Skydome(gl)
}
