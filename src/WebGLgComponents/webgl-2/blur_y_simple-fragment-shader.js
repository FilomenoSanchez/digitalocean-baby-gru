var blur_y_simple_fragment_shader_source = `#version 300 es\n
precision mediump float;

out vec4 fragColor;
uniform sampler2D shader0;
uniform float blurSize;

uniform coeffBuffer {
    vec4 row0;
    vec4 row1;
    vec4 row2;
    vec4 row3;
    vec4 row4;
    vec4 row5;
    vec4 row6;
    vec4 row7;
    vec4 row8;
    int nsteps;
};

in vec2 out_TexCoord0;

void main() {

    int M = nsteps;
    int N = 2 * M + 1;

    float minDistance = 0.0;
    float maxDistance = 1.0;

    vec2 u_direction = vec2(0.0,blurSize*.5);

    vec4 sum = vec4(0.0);

    for (int i = 0; i < N && i < 4; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row0[i] * texture(shader0, tc);
    }
    for (int i = 4; i < N && i < 8; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row1[i-4] * texture(shader0, tc);
    }
    for (int i = 8; i < N && i < 12; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row2[i-8] * texture(shader0, tc);
    }
    for (int i = 12; i < N && i < 16; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row3[i-12] * texture(shader0, tc);
    }
    for (int i = 16; i < N && i < 20; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row4[i-16] * texture(shader0, tc);
    }
    for (int i = 20; i < N && i < 24; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row5[i-20] * texture(shader0, tc);
    }
    for (int i = 24; i < N && i < 28; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row6[i-24] * texture(shader0, tc);
    }
    for (int i = 28; i < N && i < 32; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row7[i-28] * texture(shader0, tc);
    }
    for (int i = 32; i < N && i < 36; i++) {
        vec2 tc = out_TexCoord0 + u_direction * float(i - M);
        sum += row8[i-32] * texture(shader0, tc);
    }

    fragColor = sum;

}
`;

export {blur_y_simple_fragment_shader_source};
