uniform float uTime;
uniform vec2 uResolution;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.01

#include ./sdf/3d.glsl

vec3 repeat(vec3 p, float c) {
  return mod(p, c) - 0.5 * c;
}

float scene(vec3 p) {
  vec3 s = repeat(p - vec3(0.0, 0.0, -5.0), 2.0);
  float sphereDist = length(s) - 0.5;

  float distance = sphereDist;

  return distance;
}

float raymarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  vec3 color = vec3(0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    // p = fract(p * 10.);

    float dS = scene(p);
    dO += dS;

    if (dO > MAX_DIST || dS < SURFACE_DIST) {
      break;
    }
  }
  return dO;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(.01, 0);

  vec3 n = scene(p) - vec3(
        scene(p - e.xyy),
        scene(p - e.yxy),
        scene(p - e.yyx));

  return normalize(n);
}

float softShadows(vec3 ro, vec3 rd, float mint, float maxt, float k) {
  float resultingShadowColor = 1.0;
  float t = mint;
  for (int i = 0; i < 50 && t < maxt; i++) {
    float h = scene(ro + rd * t);
    if (h < 0.001)
      return 0.0;
    resultingShadowColor = min(resultingShadowColor, k * h / t);
    t += h;
  }
  return resultingShadowColor;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution - vec2(.5);
  uv.x *= uResolution.x / uResolution.y;

  // Light Position
  vec3 lightPosition = vec3(-100.0 * cos(uTime * 0.2), 100.0 * sin(uTime * 0.5), 100.0 * cos(-uTime * 0.5));

  // Ray Origin - camera
  vec3 ro = vec3(0.0, 0.0, 5.0);
  // Ray Direction
  vec3 rd = normalize(vec3(uv, -1.0));
  // Raymarching
  float d = raymarch(ro, rd);
  vec3 p = ro + rd * d;

  vec3 color = vec3(0.0);

  if (d < MAX_DIST) {
    vec3 normal = getNormal(p);
    vec3 lightDirection = normalize(lightPosition - p);

    float diffuse = max(dot(normal, lightDirection), 0.0);
    float shadows = softShadows(p, lightDirection, 0.1, 5.0, 64.0);
    color = vec3(1.0, 1.0, 1.0) * diffuse * shadows;
  }
  gl_FragColor = vec4(color, 1.);
}
