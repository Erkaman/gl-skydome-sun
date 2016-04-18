
precision mediump float;


attribute vec3 aPosition;

uniform mat4 uView;
uniform mat4 uProjection;

varying vec3 vDir;

void main() {
    gl_Position = uProjection * uView * vec4(aPosition, 1.0);
    vDir = normalize(aPosition);
}
