float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return mix(outMin, outMax, (value - inMin) / (inMax - inMin));
}
float remapClamped(float value, float inMin, float inMax, float outMin, float outMax) {
  float t = clamp((value - inMin) / (inMax - inMin), 0.0, 1.0);
  return mix(outMin, outMax, t);
}

float smin(float a, float b, float s) {
  return (a + b - sqrt(pow(a - b, 2.) + s)) / 2.;
}

float smax(float a, float b, float s) {
  return (a + b + sqrt(pow(a - b, 2.) + s)) / 2.;
}

// Warn : this rotate func is AI generated, not yet tested.
vec2 rotate(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return vec2(
    p.x * c - p.y * s,
    p.x * s + p.y * c
  );
}

vec2 rotate(vec2 p, float angle, vec2 pivot) {
  return rotate(p - pivot, angle) + pivot;
}

vec3 rotate(vec3 p, float angle, vec3 axis) {
  axis = normalize(axis);

  float c = cos(angle);
  float s = sin(angle);

  return p * c
    + cross(axis, p) * s
    + axis * dot(axis, p) * (1.0 - c);
}

vec3 rotate(vec3 p, float angle, vec3 axis, vec3 pivot) {
  return rotate(p - pivot, angle, axis) + pivot;
}

vec3 rotate(vec3 p, vec3 angles) {

  // X
  float cx = cos(angles.x);
  float sx = sin(angles.x);

  p = vec3(
      p.x,
      p.y * cx - p.z * sx,
      p.y * sx + p.z * cx
    );

  // Y
  float cy = cos(angles.y);
  float sy = sin(angles.y);

  p = vec3(
      p.x * cy - p.z * sy,
      p.y,
      p.x * sy + p.z * cy
    );

  // Z
  float cz = cos(angles.z);
  float sz = sin(angles.z);

  p = vec3(
      p.x * cz - p.y * sz,
      p.x * sz + p.y * cz,
      p.z
    );

  return p;
}

vec3 rotate(vec3 p, vec3 angles, vec3 pivot) {
  return rotate(p - pivot, angles) + pivot;
}
