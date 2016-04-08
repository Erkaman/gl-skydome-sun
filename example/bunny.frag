precision mediump float;

varying vec3 vNormal;

void main() {

    vec3 rabbitColor = vec3(0.7);

    vec3 ambient = 0.7 * rabbitColor;

    float phong = dot(vNormal, vec3(0.71, 0.71, 0) );
    vec3 diffuse = phong * rabbitColor;

    gl_FragColor = vec4(ambient + diffuse, 1.0);
}
