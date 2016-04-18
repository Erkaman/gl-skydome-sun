precision mediump float;

#pragma glslify: random = require(glsl-random)


uniform samplerCube uTexture;

uniform vec3 uLowerColor;
uniform vec3 uUpperColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uSunSize; // in range [0, 500]
uniform float uRenderSun;
uniform float uDoDithering;
uniform float uDitheringAmmount;

// direction from the center of skybox to the current fragment.
varying vec3 vDir;


vec3 hash(vec3 p)
{
	return vec3(random(vec2(p.x, p.x+p.y+p.z) ));
}

void main() {

  vec3 direction = vDir;

  float a = max(0.0, dot(direction, vec3(0.0, 1.0, 0.0)));
  vec3 skyColor = mix(uLowerColor, uUpperColor, a);


  float sunTheta = max(dot(direction, uSunDirection), 0.0);

  // draw sun.
  vec3 sun = max(sunTheta- (1.0 - uSunSize / 1000.0  ) , 0.0)*uSunColor*51.0;

  // create a nice, atmospheric ring around the sun.
  vec3 sunAtmosphere =  max(sunTheta- (  1.0 - (uSunSize+15.0) / 1000.0 ) , 0.0)  *uSunColor*51.0;

 gl_FragColor = vec4(skyColor +(sun +sunAtmosphere) * uRenderSun + uDoDithering*hash(direction)*uDitheringAmmount , 1.0);
}
