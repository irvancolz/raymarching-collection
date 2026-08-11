float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return mix(outMin, outMax, (value - inMin) / (inMax - inMin));
}
float remapClamped(float value, float inMin, float inMax, float outMin, float outMax) {
  float t = clamp((value - inMin) / (inMax - inMin), 0.0, 1.0);
  return mix(outMin, outMax, t);
}

float smin(float a, float b, float s) {
  return (a + b - sqrt(pow(a - b, 2.) + s)) / 2.
}

float smax(float a, float b, float s) {
  return (a + b + sqrt(pow(a - b, 2.) + s)) / 2.
}
