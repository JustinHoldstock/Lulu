export default `#version 300 es

precision highp float;
 
in vec2 v_texCoord;

uniform vec4 u_color;
uniform sampler2D u_image;

out vec4 outColor;
 
void main() {
  outColor = texture(u_image, v_texCoord) * u_color;
}
`;