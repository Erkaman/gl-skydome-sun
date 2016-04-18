'use strict'

/* global requestAnimationFrame */

var bunny = require('bunny')
var mat4 = require('gl-mat4')
var Geometry = require('gl-geometry')
var glShader = require('gl-shader')
var glslify = require('glslify')
var normals = require('normals')
var createOrbitCamera = require('orbit-camera')
var vec3 = require('gl-vec3')
var createSkydome = require('../index.js')
var shell = require("gl-now")()

var bunnyProgram, skydome,bunnyGeom;

var camera = createOrbitCamera()
camera.center = [0, 4, 0];
camera.distance = 32;
camera.rotation = [0.10503429174423218, -0.8922743797302246, 0.18369752168655396, 0.3988351821899414]


var sunDir = vec3.fromValues(0.71, 0.71, 0);

shell.on("gl-init", function () {
    var gl = shell.gl

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    bunnyGeom = Geometry(gl)
    bunnyGeom.attr('aPosition', bunny.positions)
    bunnyGeom.attr('aNormal', normals.vertexNormals(bunny.cells, bunny.positions))
    bunnyGeom.faces(bunny.cells)

    bunnyProgram = glShader(gl, glslify('./bunny.vert'), glslify('./bunny.frag'))

    skydome = createSkydome(gl )

    gl.clearColor(1, 0, 1, 1)

})



shell.on("gl-render", function (t) {

    var gl = shell.gl

    var canvas = shell.canvas;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    var model = mat4.create()
    var projection = mat4.create()

    var scratch = mat4.create()
    var view = camera.view(scratch);


    mat4.perspective(projection, Math.PI / 2, canvas.width / canvas.height, 0.1, 200.0)

    skydome.draw(
        // camera
        {
        view: view,
        projection: projection
        },
        //opts
        {
            sunDirection : sunDir,
            doDithering:true,
            renderSun:true,


        })


    bunnyProgram.bind()
    bunnyGeom.bind(bunnyProgram)
    bunnyProgram.uniforms.uModel = model
    bunnyProgram.uniforms.uView = view
    bunnyProgram.uniforms.uProjection = projection
    bunnyGeom.draw()

})

shell.on("tick", function() {
    if(shell.wasDown("mouse-left")) {
        camera.rotate([shell.mouseX/shell.width-0.5, shell.mouseY/shell.height-0.5],
            [shell.prevMouseX/shell.width-0.5, shell.prevMouseY/shell.height-0.5])
    }
    if(shell.wasDown("mouse-right")) {
        console.log(camera);
    }
    if(shell.scroll[1]) {
        camera.zoom(shell.scroll[1] * 0.1)
    }
})