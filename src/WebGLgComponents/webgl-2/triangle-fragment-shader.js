var triangle_fragment_shader_source = `#version 300 es\n
    precision mediump float;
    in lowp vec4 vColor;
    in lowp vec3 vNormal;
    in lowp vec4 eyePos;
    in lowp vec3 v;
    in mediump mat4 mvInvMatrix;

    uniform vec4 fogColour;

    uniform float fog_end;
    uniform float fog_start;

    uniform vec4 clipPlane0;
    uniform vec4 clipPlane1;
    uniform vec4 clipPlane2;
    uniform vec4 clipPlane3;
    uniform vec4 clipPlane4;
    uniform vec4 clipPlane5;
    uniform vec4 clipPlane6;
    uniform vec4 clipPlane7;
    uniform int nClipPlanes;

    uniform vec2 cursorPos;

    uniform bool shinyBack;
    uniform bool defaultColour;
    uniform vec4 backColour;

    uniform vec4 light_positions;
    uniform vec4 light_colours_ambient;
    uniform vec4 light_colours_specular;
    uniform vec4 light_colours_diffuse;
    uniform float specularPower;

    out vec4 fragColor;

    void main(void) {
      if(dot(eyePos, clipPlane0)<0.0){
       discard;
      }
      if(dot(eyePos, clipPlane1)<0.0){
       discard;
      }
      vec3 L;
      vec3 E;
      vec3 R;
      vec4 Iamb =vec4(0.0,0.0,0.0,0.0);
      vec4 Idiff=vec4(0.0,0.0,0.0,0.0);
      vec4 Ispec=vec4(0.0,0.0,0.0,0.0);
      vec3 norm = normalize(vNormal);

      E = (mvInvMatrix * vec4(normalize(-v),1.0)).xyz;
      L = normalize((mvInvMatrix *light_positions).xyz);
      R = normalize(-reflect(L,norm));
      Iamb += light_colours_ambient;
      Idiff += light_colours_diffuse * max(dot(norm,L), 0.0);
      float y = max(max(light_colours_specular.r,light_colours_specular.g),light_colours_specular.b);
      Ispec += light_colours_specular * pow(max(dot(R,E),0.0),specularPower);
      Ispec.a *= y;

      float FogFragCoord = abs(eyePos.z/eyePos.w);
      float fogFactor = (fog_end - FogFragCoord)/(fog_end - fog_start);
      fogFactor = 1.0 - clamp(fogFactor,0.0,1.0);

      vec4 theColor = vec4(vColor);

      vec4 color = (1.5*theColor*Iamb + 1.2*theColor* Idiff);
      color.a = vColor.a;
      color += Ispec;

      if(gl_FrontFacing!=true){
          color = vec4(vColor);
      }

      fragColor = mix(color, fogColour, fogFactor );

    }
`;

export {triangle_fragment_shader_source};
