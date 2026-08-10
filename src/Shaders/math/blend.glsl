float darken(float a, float b) {
  return min(a, b);
}

vec3 darken(vec3 a, vec3 b) {
  return vec3(
    darken(a.r, b.r),
    darken(a.g, b.g),
    darken(a.b, b.b)
  );
}

vec3 darken(vec3 a, vec3 b, float o) {
  return darken(a, b) * o + a * (1.0 - o);
}

float lighten(float a, float b) {
  return max(a, b);
}

vec3 lighten(vec3 a, vec3 b) {
  return vec3(
    lighten(a.r, b.r),
    lighten(a.g, b.g),
    lighten(a.b, b.b)
  );
}

vec3 lighten(vec3 a, vec3 b, float o) {
  return lighten(a, b) * o + a * (1.0 - o);
}
