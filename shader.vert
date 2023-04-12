#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform float u_time;
uniform vec2 u_resolution;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTexCoord;

void main() {

  // calculate position in view space
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // pass varyings to fragment shader
  vTexCoord = aTexCoord; // texture coordinate
  
  // calculate position in camera space
  gl_Position = uProjectionMatrix * viewModelPosition; 
}
