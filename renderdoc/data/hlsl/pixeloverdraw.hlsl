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

#if !defined(UAV_SPACE) && defined(D3D12)
// must match the define in hlsl_cbuffers.h
#define UAV_SPACE space105202922
#endif

#if defined(D3D12)
RWTexture2D<uint> overdrawUAV : register(u0, UAV_SPACE);
#else
RWTexture2D<uint> overdrawUAV : register(u0);
#endif

Texture2D<uint> overdrawSRV : register(t0);

[earlydepthstencil] void RENDERDOC_PixelOverdrawPS(float4 vpos : SV_Position) {
  // Simple pixel-level overdraw counting - just increment a counter for each pixel
  uint2 pixel = uint2(vpos.xy);
  InterlockedAdd(overdrawUAV[pixel], 1);
}

float4 RENDERDOC_POResolvePS(float4 vpos : SV_POSITION) : SV_Target0
{
  uint2 pixel = uint2(vpos.xy);
  uint overdraw = overdrawSRV[pixel];
  return float(overdraw).xxxx;
}