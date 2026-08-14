struct LightsUniform {
  vec3 color;
  float intensity;
};

uniform float uTime;
uniform float uCursorRadius;
uniform float uCursorMix;
uniform float uStickRadius;
uniform vec2 uResolution;
uniform vec2 uCursor;

uniform LightsUniform ambientLights;
#ifdef NUM_DIFFUSE_LIGHTS
uniform LightsUniform[NUM_DIFFUSE_LIGHTS] diffuseLights;
#endif

#define PI 3.141592653589793
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.01

#include ../math/common.glsl
#include ../sdf/3d.glsl
#include ../lights.glsl

vec3 branches(float i, int c) {
  float a = i / float(c) * (PI * 2.);
  return vec3(sin(a), 0., cos(a));
}

float scene(vec3 p) {
  vec3 p1 = p;
  p1.y += sin(uTime * .3) * .3;
  // ps1.xz += sin((ps1.y + uTime * .2) * 30.) * .02;
  float s1 = sdSphere(p1, 1.);
  float d = s1;

  float aspect = uResolution.x / uResolution.y;
  vec3 cursor = vec3(uCursor, 0.);
  // cursor.xy *= 1. + aspect;
  // cursor.xy *= uResolution / min(uResolution.x, uResolution.y);

  vec3 p2 = p - cursor;
  float s2 = sdSphere(p2, uCursorRadius);

  // d = smin(s1, s2, .02);

  // small spheres rotating
  float s = .1;
  float speed = uTime;

  int MC = 4;
  for (int i = 0; i < MC; i++) {
    vec3 pm = p;
    vec3 om = branches(float(i), MC);
    pm -= om;
    pm = rotate(pm, speed * (.1 + float(i)), vec3(0., 1., 0.), om * -1. * remap(sin(speed + float(i)), -1., 1., .5, 1.));

    float sm = sdSphere(pm, .5);
    d = smin(d, sm, s);
  }

  vec3 p3 = p;
  p3 = rotate(p3, speed * .3, vec3(0., 1., 0.), vec3(0.));
  // p3 *= 1. / 4.;
  float freq = 8.;
  float ampl = .03;
  // p3.x += sin(p3.y * freq + uTime * 4.) * ampl;
  // p3.x += cos(p3.y * freq + uTime * 4.) * ampl;
  float s3 = sdOctahedron(p3, uStickRadius);
  d = smin(s2, s3, uCursorMix);
  // d = s3;

  return d;
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

vec3 applyLights(vec3 p, vec3 normal, vec3 viewDir) {
  vec3 light = vec3(0.);
  vec3 lightPosition = vec3(-100.0, 100.0, 100.0);
  vec3 lightDirection = normalize(lightPosition - p);
  vec3 viewDirection = normalize(viewDir);

  float shadows = softShadows(p, lightDirection, 0.1, 5.0, 64.0);

  light += diffuse(diffuseLights[0].color, diffuseLights[0].intensity, normal, lightDirection, viewDirection);
  light += diffuse(diffuseLights[1].color, diffuseLights[1].intensity, normal, lightDirection * -1., viewDirection);
  light += ambient(ambientLights.color, ambientLights.intensity);

  // light *= shadows;
  return light;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution - vec2(.5);
  uv.x *= uResolution.x / uResolution.y;

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
    vec3 light = applyLights(p, normal, normalize(p - ro));
    color = vec3(1.0, 1.0, 1.0) * light;
  }
  gl_FragColor = vec4(color, 1.);
  // gl_FragColor = vec4(vec3(uv, 0.), 1.);
}
