vec3 diffuse(vec3 col, float i, vec3 normal, vec3 dir, vec3 viewDir) {
  float shading = dot(normal, normalize(dir));
  shading = max(0., shading);

  float specular = -dot(normal, viewDir);
  specular = max(0., specular);
  specular = pow(specular, 20.);

  return col * i * shading + specular;
}

vec3 ambient(vec3 col, float i) {
  return col * i;
}
