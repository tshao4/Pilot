#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    highp float max_color = float(lut_tex_size.y - 1);
    highp float width = float(lut_tex_size.x);
    highp float height = _COLORS;


    highp float cell = color.b * max_color;
    highp float cell1 = floor(cell);
    highp float cell2 = ceil(cell);

    highp float half_px_x = 0.5 / width;
    highp float half_px_y = 0.5 / height;
    
    highp float u = half_px_x + color.r / _COLORS * (max_color / _COLORS);
    highp float v = half_px_y + color.g * (max_color / _COLORS);

    highp vec4 color1 = texture(color_grading_lut_texture_sampler, vec2(cell1 / _COLORS + u, v)).rgba;
    highp vec4 color2 = texture(color_grading_lut_texture_sampler, vec2(cell2 / _COLORS + u, v)).rgba;

    out_color = mix(color1, color2, fract(cell));
}
