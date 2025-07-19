/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2025 Baldur Karlsson
 * Copyright (c) 2014 Crytek
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ******************************************************************************/

#if defined(OPENGL_ES)
#extension GL_OES_shader_image_atomic : enable
#else
#extension GL_ARB_shader_image_load_store : require
#endif

#if defined(VULKAN) && defined(USE_MULTIVIEW)
#extension GL_EXT_multiview : require
#endif

#ifdef VULKAN
// descriptor set will be patched from 0 to whichever descriptor set we're using in code
layout(set = 0, binding = 0, r32ui) uniform coherent uimage2D overdrawImage;
#else    // OPENGL and OPENGL_ES

// if we're compiling for GL SPIR-V, give the image an explicit binding
#ifdef GL_SPIRV
layout(binding = 0, r32ui)
#else
layout(r32ui)
#endif

    uniform coherent uimage2D overdrawImage;

#endif
layout(early_fragment_tests) in;

void main()
{
  // Simple pixel-level overdraw counting - just increment a counter for each pixel
  ivec2 pixel = ivec2(gl_FragCoord.xy);
  imageAtomicAdd(overdrawImage, pixel, 1);
}