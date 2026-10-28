import {
  BufferAttribute,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  SRGBColorSpace,
  Scene,
  Texture,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from 'three';
import { USDLoader } from 'three/addons/loaders/USDLoader.js';

// ===== Screens (lock screen images) =====
const INNER_WIDTH = 1600;
const OUTER_WIDTH = 774;
const HEIGHT = 1125;
const UI_ASSETS = './assets/ui/';

const CLOCK_TIME_BOX = { width: 0.73, height: 0.54 };
const OUTER_WALLPAPER_BIAS = -0.1;

async function loadImage(src) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

function canvasContext(canvas) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('A 2D canvas context is not available.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  return context;
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function keepBox(plate, box, inside) {
  const canvas = createCanvas(plate.naturalWidth, plate.naturalHeight);
  const context = canvasContext(canvas);
  context.drawImage(plate, 0, 0);
  if (inside) {
    context.clearRect(box.width, 0, canvas.width - box.width, canvas.height);
    context.clearRect(0, box.height, box.width, canvas.height - box.height);
  } else {
    context.clearRect(0, 0, box.width, box.height);
  }
  return canvas;
}

function splitClock(plate) {
  const box = {
    width: Math.round(plate.naturalWidth * CLOCK_TIME_BOX.width),
    height: Math.round(plate.naturalHeight * CLOCK_TIME_BOX.height),
  };
  return { time: keepBox(plate, box, true), chrome: keepBox(plate, box, false) };
}

async function loadLockScreen() {
  const [backdrop, sky, mountain, innerClock, outerClock] = await Promise.all([
    loadImage(`${UI_ASSETS}base.webp`),
    loadImage(`${UI_ASSETS}top.webp`),
    loadImage(`${UI_ASSETS}middle.webp`),
    loadImage(`${UI_ASSETS}clock-inner.avif`),
    loadImage(`${UI_ASSETS}clock-outer.avif`),
  ]);
  return { backdrop, sky, mountain, innerClock: splitClock(innerClock), outerClock: splitClock(outerClock) };
}

function drawCover(context, image, width, height, bias = 0) {
  const source = image instanceof HTMLCanvasElement ? { width: image.width, height: image.height } : image;
  const scale = Math.max(width / source.width, height / source.height);
  const drawn = { width: source.width * scale, height: source.height * scale };
  const left = Math.min(0, Math.max(width - drawn.width, (width - drawn.width) / 2 + bias * width));
  context.drawImage(image, left, (height - drawn.height) / 2, drawn.width, drawn.height);
}

function paintPanelLockScreen(lockScreen, panel, turn) {
  const width = panel === 'inner' ? INNER_WIDTH : OUTER_WIDTH;
  const upright = turn === 'none';
  const clock = (panel === 'inner') === upright ? lockScreen.innerClock : lockScreen.outerClock;
  const canvas = createCanvas(width, HEIGHT);
  const context = canvasContext(canvas);
  if (turn === 'clockwise') {
    context.translate(width, 0);
    context.rotate(Math.PI / 2);
  } else if (turn === 'anticlockwise') {
    context.translate(0, HEIGHT);
    context.rotate(-Math.PI / 2);
  }
  const frame = upright ? { width, height: HEIGHT } : { width: HEIGHT, height: width };
  const bias = panel === 'outer' ? OUTER_WALLPAPER_BIAS : 0;
  const foreground = createCanvas(frame.width, frame.height);
  const front = canvasContext(foreground);
  drawCover(front, lockScreen.backdrop, frame.width, frame.height, bias);
  front.globalCompositeOperation = 'destination-out';
  drawCover(front, lockScreen.sky, frame.width, frame.height, bias);
  drawCover(context, lockScreen.backdrop, frame.width, frame.height, bias);
  context.drawImage(clock.time, 0, 0, frame.width, frame.height);
  context.drawImage(foreground, 0, 0);
  context.drawImage(clock.chrome, 0, 0, frame.width, frame.height);
  return canvas;
}

function paintFittedImage(image) {
  const canvas = createCanvas(INNER_WIDTH, HEIGHT);
  const context = canvasContext(canvas);
  context.fillStyle = '#101418';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const source = image instanceof HTMLCanvasElement ? { width: image.width, height: image.height } : image;
  const scale = Math.min(canvas.width / source.width, canvas.height / source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  return canvas;
}

async function paintCustomImage(file) {
  const url = URL.createObjectURL(file);
  try {
    return paintFittedImage(await loadImage(url));
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function loadStaticImage(src) {
  return paintFittedImage(await loadImage(src));
}

async function loadPanelImage(src, panel) {
  const image = await loadImage(src);
  const canvas = createCanvas(panel === 'inner' ? INNER_WIDTH : OUTER_WIDTH, HEIGHT);
  drawCover(canvasContext(canvas), image, canvas.width, canvas.height);
  return canvas;
}

// ===== Wipe (blur/fold pass) =====

const FRAME_CORNER = 110 / 1878;

const QUAD_VERTEX = `
in vec2 uv;
in vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const COMPOSE_FRAGMENT = `
precision highp float;
uniform sampler2D backdropMap;
uniform sampler2D skyMap;
uniform sampler2D mountainMap;
uniform sampler2D timeMap;
uniform sampler2D chromeMap;
uniform vec4 backdropFrame;
uniform vec4 skyFrame;
uniform vec4 mountainFrame;
uniform vec4 duneFrame;
uniform float landscapeOpacity;
uniform float plateOpacity;
in vec2 vUv;
out vec4 fragColor;
vec3 over(vec3 under, vec4 layer) {
  return under * (1.0 - layer.a) + layer.rgb;
}
vec4 sheet(sampler2D map, vec4 frame) {
  return texture(map, frame.xy + vUv * frame.zw) * landscapeOpacity;
}
void main() {
  vec3 colour = texture(backdropMap, backdropFrame.xy + vUv * backdropFrame.zw).rgb;
  colour = over(colour, sheet(skyMap, skyFrame));
  colour = over(colour, texture(timeMap, vUv) * plateOpacity);
  colour = over(colour, sheet(mountainMap, mountainFrame));
  vec2 dune = duneFrame.xy + vUv * duneFrame.zw;
  float sand = (1.0 - max(texture(skyMap, dune).a, texture(mountainMap, dune).a)) * landscapeOpacity;
  colour = over(colour, vec4(texture(backdropMap, dune).rgb * sand, sand));
  colour = over(colour, texture(chromeMap, vUv) * plateOpacity);
  fragColor = vec4(colour, 1.0);
}
`;

const FRAME_FRAGMENT = `
precision highp float;
uniform sampler2D map;
uniform float cornerRadius;
in vec2 vUv;
out vec4 fragColor;
float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}
void main() {
  vec2 uv = (vUv - 0.5) / 0.9 + 0.5;
  vec2 imgSize = vec2(textureSize(map, 0));
  vec2 aspect = vec2(imgSize.x / imgSize.y, 1.0);
  float maxBounds = min(imgSize.x, imgSize.y);
  float corners = cornerRadius / maxBounds;
  if (imgSize.x < imgSize.y && uv.x < 0.5) corners = 0.0;
  vec2 center = vec2(0.5) * aspect;
  float area = sdRoundedBox(uv * aspect - center, center, corners);
  fragColor = vec4(texture(map, uv).rgb * smoothstep(0.0, 2.0 / maxBounds, -area), 1.0);
}
`;

const BLUR_FRAGMENT = `
precision highp float;
uniform sampler2D map;
uniform float wipeAmount;
uniform float wipePosition;
uniform vec2 blurBounds;
in vec2 vUv;
out vec4 fragColor;
#define maxBlur 8.0
float w0(float a) { return (1.0/6.0)*(a*(a*(-a + 3.0) - 3.0) + 1.0); }
float w1(float a) { return (1.0/6.0)*(a*a*(3.0*a - 6.0) + 4.0); }
float w2(float a) { return (1.0/6.0)*(a*(a*(-3.0*a + 3.0) + 3.0) + 1.0); }
float w3(float a) { return (1.0/6.0)*(a*a*a); }
float g0(float a) { return w0(a) + w1(a); }
float g1(float a) { return w2(a) + w3(a); }
float h0(float a) { return -1.0 + w1(a) / (w0(a) + w1(a)); }
float h1(float a) { return 1.0 + w3(a) / (w2(a) + w3(a)); }
vec4 bicubic(sampler2D tex, vec2 uv, vec4 texelSize, float lod) {
  uv = uv * texelSize.zw + 0.5;
  vec2 iuv = floor(uv);
  vec2 fuv = fract(uv);
  float g0x = g0(fuv.x);
  float g1x = g1(fuv.x);
  float h0x = h0(fuv.x);
  float h1x = h1(fuv.x);
  float h0y = h0(fuv.y);
  float h1y = h1(fuv.y);
  vec2 p0 = (vec2(iuv.x + h0x, iuv.y + h0y) - 0.5) * texelSize.xy;
  vec2 p1 = (vec2(iuv.x + h1x, iuv.y + h0y) - 0.5) * texelSize.xy;
  vec2 p2 = (vec2(iuv.x + h0x, iuv.y + h1y) - 0.5) * texelSize.xy;
  vec2 p3 = (vec2(iuv.x + h1x, iuv.y + h1y) - 0.5) * texelSize.xy;
  return g0(fuv.y) * (g0x * textureLod(tex, p0, lod) + g1x * textureLod(tex, p1, lod))
       + g1(fuv.y) * (g0x * textureLod(tex, p2, lod) + g1x * textureLod(tex, p3, lod));
}
vec4 textureBicubic(sampler2D s, vec2 uv, float lod) {
  vec2 lodSizeFloor = vec2(textureSize(s, int(lod)));
  vec2 lodSizeCeil = vec2(textureSize(s, int(lod + 1.0)));
  vec4 floorSample = bicubic(s, uv, vec4(1.0 / lodSizeFloor.x, 1.0 / lodSizeFloor.y, lodSizeFloor.x, lodSizeFloor.y), floor(lod));
  vec4 ceilSample = bicubic(s, uv, vec4(1.0 / lodSizeCeil.x, 1.0 / lodSizeCeil.y, lodSizeCeil.x, lodSizeCeil.y), ceil(lod));
  return mix(floorSample, ceilSample, fract(lod));
}
float remap(float minValue, float maxValue, float value) {
  return (value - minValue) / (maxValue - minValue);
}
void main() {
  float distanceToWipe = distance(vUv.x, wipePosition);
  float blurArea = remap(0.0, 0.75, clamp(remap(blurBounds.x, blurBounds.y, distanceToWipe) * wipeAmount * 2.5, 0.0, 1.0));
  vec3 shade = vec3(smoothstep(1.3, 0.9, blurArea) * smoothstep(1.0, 0.9, distance(vUv.y, 0.5) * 2.0));
  vec4 sharp = blurArea <= 0.0 ? textureLod(map, vUv, 0.0) : textureBicubic(map, vUv, blurArea * maxBlur);
  fragColor = sharp * vec4(shade, 1.0);
}
`;

function createTarget(width, height, anisotropy) {
  const target = new WebGLRenderTarget(width, height, {
    depthBuffer: false,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    magFilter: LinearFilter,
  });
  target.texture.colorSpace = SRGBColorSpace;
  target.texture.anisotropy = anisotropy;
  return target;
}

class ScreenWipe {
  constructor(anisotropy, sizes) {
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    this.quad = new Mesh(new PlaneGeometry(1, 1));
    this.scene.add(this.quad);
    const shared = { glslVersion: '300 es', depthTest: false, depthWrite: false };
    this.composeMaterial = new RawShaderMaterial({
      ...shared,
      vertexShader: QUAD_VERTEX,
      fragmentShader: COMPOSE_FRAGMENT,
      uniforms: {
        backdropMap: { value: null },
        skyMap: { value: null },
        mountainMap: { value: null },
        timeMap: { value: null },
        chromeMap: { value: null },
        backdropFrame: { value: new Vector4(0, 0, 1, 1) },
        skyFrame: { value: new Vector4(0, 0, 1, 1) },
        mountainFrame: { value: new Vector4(0, 0, 1, 1) },
        duneFrame: { value: new Vector4(0, 0, 1, 1) },
        landscapeOpacity: { value: 1 },
        plateOpacity: { value: 1 },
      },
    });
    this.frameMaterial = new RawShaderMaterial({
      ...shared,
      vertexShader: QUAD_VERTEX,
      fragmentShader: FRAME_FRAGMENT,
      uniforms: { map: { value: null }, cornerRadius: { value: 0 } },
    });
    this.blurMaterial = new RawShaderMaterial({
      ...shared,
      vertexShader: QUAD_VERTEX,
      fragmentShader: BLUR_FRAGMENT,
      uniforms: {
        map: { value: null },
        wipeAmount: { value: 0 },
        wipePosition: { value: 0 },
        blurBounds: { value: new Vector2(0.45, 1) },
      },
    });
    const build = (panel) => {
      const { x, y } = sizes[panel];
      return {
        compose: createTarget(x, y, anisotropy),
        frame: createTarget(x, y, anisotropy),
        first: createTarget(x, y, anisotropy),
        second: createTarget(x, y, anisotropy),
        position: panel === 'inner' ? 1 : 0,
        bounds: panel === 'inner' ? new Vector2(0.45, 1) : new Vector2(0, 0.9),
      };
    };
    this.passes = { inner: build('inner'), outer: build('outer') };
  }

  texture(panel) {
    return this.passes[panel].second.texture;
  }

  draw(renderer, material, target) {
    this.quad.material = material;
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }

  render(renderer, panel, source, amount) {
    const pass = this.passes[panel];
    const previousTarget = renderer.getRenderTarget();
    const previousToneMapping = renderer.toneMapping;
    renderer.toneMapping = NoToneMapping;

    const compose = this.composeMaterial.uniforms;
    const landscape = source.landscape;
    compose.backdropMap.value = source.backdrop;
    compose.skyMap.value = landscape?.sky ?? source.backdrop;
    compose.mountainMap.value = landscape?.mountain ?? source.backdrop;
    compose.landscapeOpacity.value = landscape ? 1 : 0;
    compose.timeMap.value = source.clock?.time ?? source.backdrop;
    compose.chromeMap.value = source.clock?.chrome ?? source.backdrop;
    compose.plateOpacity.value = source.clock ? 1 : 0;
    compose.backdropFrame.value.copy(source.backdropFrame);
    if (landscape) {
      compose.skyFrame.value.copy(landscape.skyFrame);
      compose.mountainFrame.value.copy(landscape.mountainFrame);
      compose.duneFrame.value.copy(landscape.duneFrame);
    }
    this.draw(renderer, this.composeMaterial, pass.compose);

    this.frameMaterial.uniforms.map.value = pass.compose.texture;
    this.frameMaterial.uniforms.cornerRadius.value = FRAME_CORNER * pass.compose.height;
    this.draw(renderer, this.frameMaterial, pass.frame);

    this.blurMaterial.uniforms.wipeAmount.value = amount;
    this.blurMaterial.uniforms.wipePosition.value = pass.position;
    this.blurMaterial.uniforms.blurBounds.value.copy(pass.bounds);
    this.blurMaterial.uniforms.map.value = pass.frame.texture;
    this.draw(renderer, this.blurMaterial, pass.first);
    this.blurMaterial.uniforms.map.value = pass.first.texture;
    this.draw(renderer, this.blurMaterial, pass.second);

    renderer.setRenderTarget(previousTarget);
    renderer.toneMapping = previousToneMapping;
  }
}

// ===== Foldable (model + shaders) =====

const MODEL_URL = './assets/iPhone_Duo_Render.usdc';
// Fallback for progress when the server compresses the response and omits its length.
const MODEL_BYTES = 3_638_212;
const MODEL_SCALE = 100;
const MODEL_DROP = 5.8974;
const COVER_HALF = 'upTUAKvMVkPOMKq';
const CAMERA_HALF = 'SiftyleUEEZwLhF';
const INNER_SCREEN = 'UXtsBZYlaUvHoEh';
const OUTER_SCREEN = 'hhgAIoCGsHXeDPY';
const FLEXIBLE_MESHES = new Set(['JnJdTkxbQgUtLwU', 'xdyyaajWsatVNxN', INNER_SCREEN, 'MvKPXGSdYDVvSpk']);
const UI_REFERENCE_EYE = new Vector3(0, 0, 40);
const INNER_UI_FRAME = new Vector4(-7.89935, 0.34562 - MODEL_DROP, 15.7987, 11.1035);
const OUTER_UI_FRAME = new Vector4(0.23396, 0.27173 - MODEL_DROP, 7.73936, 11.2513).multiplyScalar(
  (UI_REFERENCE_EYE.z - 0.24948) / (UI_REFERENCE_EYE.z - 0.825538),
);
const INNER_PIXEL = new Vector2(1 / 1600, 1 / 1125);
const OUTER_PIXEL = new Vector2(1 / 774, 1 / 1125);
const CLOSED_ZOOM = 1.47;

const LAYER_DEPTH = { sky: 0.47, mountain: 1, dune: 0.7 };
const VIBRANCE = 1;
const screenShader = `
uniform float foldAngle;
uniform vec4 screenFrame;
uniform vec3 uiReferenceEye;
uniform float uiParallax;
uniform float uiSettle;
uniform float uiPreviousParallax;
uniform float uiPreviousSettle;
uniform float uiBlend;
uniform sampler2D uiPreviousMap;
uniform float uiVibrance;
uniform vec2 uiShade;
uniform float uiWipePosition;
varying vec3 vUIPosition;
vec3 vibrance(vec3 color) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return max(vec3(0.0), mix(vec3(luma), color, uiVibrance));
}
vec3 screenLayer(sampler2D map, float parallax, float settle) {
  float depth = (0.24948 - uiReferenceEye.z) / (vUIPosition.z - uiReferenceEye.z);
  vec2 plane = uiReferenceEye.xy + (vUIPosition.xy - uiReferenceEye.xy) * depth;
  #ifndef INNER_UI
    float c = cos(foldAngle), s = sin(foldAngle);
    vec2 hingeEdge = vec2(-0.23396, -0.27463 - 0.275454);
    vec2 foldedEdge = vec2(c * hingeEdge.x + s * hingeEdge.y,
      -s * hingeEdge.x + c * hingeEdge.y + 0.275454);
    float edgeDepth = (0.24948 - uiReferenceEye.z) / (foldedEdge.y - uiReferenceEye.z);
    plane.x += screenFrame.x - (uiReferenceEye.x + (foldedEdge.x - uiReferenceEye.x) * edgeDepth);
  #endif
  float progress = clamp(foldAngle / 3.141592654, 0.0, 1.0) * settle;
  #ifdef INNER_UI
    float wipeAmount = progress;
  #else
    float wipeAmount = clamp(1.0 - 2.0 * abs(progress - 0.5), 0.0, 1.0) * 0.5;
  #endif
  plane = mix(screenFrame.xy + vEmissiveMapUv * screenFrame.zw, plane, parallax);
  vec2 uv = ((plane - screenFrame.xy) / screenFrame.zw - 0.5) / 1.12 + 0.5;
  float distanceToWipe = distance(vEmissiveMapUv.x, uiWipePosition);
  float wipe = 1.0 - clamp(smoothstep(uiShade.x, uiShade.y, distanceToWipe) * wipeAmount * 1.5, 0.0, 1.0);
  float edges = smoothstep(1.1, 1.0, uv.x) * smoothstep(-0.1, 0.0, uv.x)
    * smoothstep(1.1, 1.0, uv.y) * smoothstep(-0.1, 0.0, uv.y);
  #ifdef INNER_UI
    edges = mix(edges, edges * smoothstep(0.05, 0.5, uv.x), smoothstep(0.0, 0.55, wipeAmount));
  #else
    float along = vEmissiveMapUv.x + (vEmissiveMapUv.y - 0.5) * 0.18;
    float offset = along - mix(1.25, -0.25, smoothstep(0.08, 0.8, progress));
    float band = 0.72 * exp(-offset * offset / 0.02) + 0.28 * exp(-offset * offset / 0.0016);
    float glint = sin(3.141592654 * clamp((progress - 0.04) / 0.8, 0.0, 1.0));
  #endif
  vec3 color = vibrance(texture(map, uv).rgb) * wipe * edges;
  #ifndef INNER_UI
    color = mix(color, vec3(1.0, 0.985, 0.96), 0.15 * glint * band);
  #endif
  return color;
}
vec3 screenColor() {
  vec3 incoming = screenLayer(emissiveMap, uiParallax, uiSettle);
  if (uiBlend >= 1.0) return incoming;
  return mix(screenLayer(uiPreviousMap, uiPreviousParallax, uiPreviousSettle), incoming, uiBlend);
}
`;
const foldShader = `
uniform float foldAngle;
vec2 rotateHinge(vec2 p) {
  float c = cos(foldAngle), s = sin(foldAngle);
  p.y -= 0.275454;
  return vec2(c * p.x + s * p.y, -s * p.x + c * p.y + 0.275454);
}
#ifdef FLEXIBLE_SCREEN
vec2 bendStrip(vec3 p) {
  float halfWidth = 0.35;
  if (p.x >= halfWidth) return vec2(p.x, p.z);
  if (p.x <= -halfWidth) return rotateHinge(p.xz);
  float t = (p.x + halfWidth) / (2.0 * halfWidth);
  float t2 = t*t, t3 = t2*t;
  vec2 a = rotateHinge(vec2(-halfWidth, p.z));
  vec2 b = vec2(halfWidth, p.z);
  vec2 ta = 2.0 * halfWidth * vec2(cos(foldAngle), -sin(foldAngle));
  vec2 tb = vec2(2.0 * halfWidth, 0.0);
  return (2.0*t3-3.0*t2+1.0)*a + (t3-2.0*t2+t)*ta + (-2.0*t3+3.0*t2)*b + (t3-t2)*tb;
}
#endif
`;
const LAYERS = ['sky', 'mountain', 'dune'];

// The USD references a few textures that are not shipped. A texture whose image never loaded samples as
// black, so an absent AO map darkens the hinge cover and an absent base map blacks out the camera plate.
const TEXTURE_SLOTS = [
  'map',
  'roughnessMap',
  'metalnessMap',
  'normalMap',
  'aoMap',
  'alphaMap',
  'clearcoatMap',
  'clearcoatNormalMap',
  'clearcoatRoughnessMap',
  'specularColorMap',
  'specularIntensityMap',
  'sheenColorMap',
  'transmissionMap',
];
const SHELL_COLOR = 0xf5f1ea;
// The hinge liner and cover ship dark; give them the titanium frame's finish so the spine reads silver.
const HINGE_MESHES = new Set(['xdyyaajWsatVNxN', 'MvKPXGSdYDVvSpk', 'pmvwSuCeZpxeLmT', 'bsNHOLGaZbhIluH']);
const FRAME_COLOR = 0xe3d9c8;
const FRAME_ROUGHNESS = 0.16;

function matchFrame(material) {
  material.color.set(FRAME_COLOR);
  material.metalness = 1;
  material.roughness = FRAME_ROUGHNESS;
  material.map = material.aoMap = material.roughnessMap = material.metalnessMap = null;
  material.needsUpdate = true;
}

function dropMissingTextures(material) {
  for (const slot of TEXTURE_SLOTS) {
    const texture = material[slot];
    if (!(texture instanceof Texture) || texture.image) continue;
    material[slot] = null;
    if (slot === 'map') material.color?.set(SHELL_COLOR);
    material.needsUpdate = true;
  }
}

function createTexture(image, anisotropy, premultiplied = false) {
  const texture = new Texture(image);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.premultiplyAlpha = premultiplied;
  texture.needsUpdate = true;
  return texture;
}

function belongsToCoverHalf(object) {
  let ancestor = object;
  while (ancestor && ancestor.name !== COVER_HALF && ancestor.name !== CAMERA_HALF) {
    ancestor = ancestor.parent;
  }
  return ancestor?.name === COVER_HALF;
}

function frameLayer(openness, depth, frame) {
  const shut = 1 + (CLOSED_ZOOM - 1) * depth;
  const zoom = MathUtils.lerp(shut, 1, MathUtils.smoothstep(openness, 0.3, 1));
  const width = INNER_UI_FRAME.z * zoom;
  const height = INNER_UI_FRAME.w * zoom;
  frame.set(-width / 2, INNER_UI_FRAME.y + INNER_UI_FRAME.w / 2 - height / 2, width, height);
}

function frameWithin(panel, layer, out) {
  return out.set(
    (panel.x - layer.x) / layer.z,
    (panel.y - layer.y) / layer.w,
    panel.z / layer.z,
    panel.w / layer.w,
  );
}

function sameDress(a, b) {
  return (
    a.backdrop === b.backdrop &&
    a.layered === b.layered &&
    a.clock === b.clock &&
    a.fit === b.fit &&
    a.settled === b.settled &&
    a.dim === b.dim
  );
}

function loadModel(onProgress) {
  return new USDLoader().loadAsync(MODEL_URL, (event) => {
    const total = event.total || MODEL_BYTES;
    onProgress?.(Math.min(event.loaded / total, 1));
  });
}

function createFoldable(model, lockScreen, anisotropy, environment) {
  const root = new Group();
  const bend = { value: 0 };
  const referenceEye = { value: UI_REFERENCE_EYE.clone() };
  const backdrop = createTexture(lockScreen.backdrop, anisotropy);
  const sky = createTexture(lockScreen.sky, anisotropy, true);
  const mountain = createTexture(lockScreen.mountain, anisotropy, true);
  // Each fitted lock screen is a full-size canvas paint, so only paint the ones a highlight asks for.
  const fitted = { inner: {}, outer: {} };

  function fittedTexture(kind, direction) {
    const cached = fitted[kind][direction];
    if (cached) return cached;
    const texture = createTexture(paintPanelLockScreen(lockScreen, kind, direction), anisotropy);
    fitted[kind][direction] = texture;
    return texture;
  }

  function warmUp() {
    const pending = [];
    for (const kind of ['inner', 'outer'])
      for (const direction of ['none', 'clockwise', 'anticlockwise'])
        if (!fitted[kind][direction]) pending.push([kind, direction]);
    // The render loop can keep a slow device from ever going idle, so each job also has a deadline.
    const idle = (callback) => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 1000 });
      else setTimeout(callback, 120);
    };
    const next = () => {
      const job = pending.shift();
      if (!job) return;
      fittedTexture(job[0], job[1]);
      idle(next);
    };
    idle(next);
  }

  let customTexture = null;
  let retired = null;
  const panelTextures = { inner: null, outer: null };
  const turn = { inner: 'none', outer: 'none' };
  let focus = null;
  let fade = 1;

  function fits(kind) {
    return turn[kind] !== 'none' || focus === kind;
  }

  function dressFor(kind) {
    const fit = fits(kind);
    const common = {
      fit,
      settled: focus === kind,
      dim: kind === 'inner' && focus === 'outer',
    };
    if (customTexture) return { ...common, backdrop: customTexture, layered: false, clock: false };
    if (panelTextures[kind]) return { ...common, fit: true, backdrop: panelTextures[kind], layered: false, clock: false };
    return {
      ...common,
      backdrop: fit ? fittedTexture(kind, turn[kind]) : backdrop,
      layered: !fit,
      clock: !fit,
    };
  }

  const sizes = {
    inner: new Vector2(1 / INNER_PIXEL.x, 1 / INNER_PIXEL.y),
    outer: new Vector2(1 / OUTER_PIXEL.x, 1 / OUTER_PIXEL.y),
  };
  const wipe = new ScreenWipe(anisotropy, sizes);
  const previousWipe = new ScreenWipe(anisotropy, sizes);

  function createScreen(kind) {
    const inner = kind === 'inner';
    const clock = inner ? lockScreen.innerClock : lockScreen.outerClock;
    const knobs = {
      settle: { value: 1 },
      previousSettle: { value: 1 },
      parallax: { value: 1 },
      previousParallax: { value: 1 },
      blend: { value: 1 },
    };
    return {
      material: new MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveMap: wipe.texture(kind),
        envMap: environment,
        roughness: inner ? 1 : 0.06,
        metalness: 0,
        envMapIntensity: inner ? 0 : 0.35,
        toneMapped: false,
      }),
      plates: {
        time: createTexture(clock.time, anisotropy, true),
        chrome: createTexture(clock.chrome, anisotropy, true),
      },
      knobs,
      current: dressFor(kind),
      previous: null,
      uniforms: {
        foldAngle: bend,
        uiSettle: knobs.settle,
        uiPreviousSettle: knobs.previousSettle,
        uiParallax: knobs.parallax,
        uiPreviousParallax: knobs.previousParallax,
        uiBlend: knobs.blend,
        uiPreviousMap: { value: previousWipe.texture(kind) },
        screenFrame: { value: inner ? INNER_UI_FRAME : OUTER_UI_FRAME },
        uiWipePosition: { value: inner ? 1 : 0 },
        uiShade: { value: inner ? new Vector2(0.5, 1) : new Vector2(0, 1) },
        uiVibrance: { value: VIBRANCE },
        uiReferenceEye: referenceEye,
      },
    };
  }

  const screens = { inner: createScreen('inner'), outer: createScreen('outer') };
  let dirty = true;
  let openness = 1;
  let shut = 0;
  let viewAmount = 1;
  const layerFrame = new Vector4();
  const composed = { sky: new Vector4(), mountain: new Vector4(), dune: new Vector4() };

  model.scale.multiplyScalar(MODEL_SCALE);
  model.updateMatrixWorld(true);
  let halfWidth = 0;
  const shell = [];

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    geometry.translate(0, -MODEL_DROP, 0);
    const moving = belongsToCoverHalf(object);
    const flexible = FLEXIBLE_MESHES.has(object.name);
    const kind = object.name === INNER_SCREEN ? 'inner' : object.name === OUTER_SCREEN ? 'outer' : null;
    const material = kind ? screens[kind].material : object.material.clone();
    if (!kind) dropMissingTextures(material);
    if (HINGE_MESHES.has(object.name)) matchFrame(material);
    if (!kind && material.color) shell.push({ color: material.color, base: material.color.clone() });
    if (!moving) {
      geometry.computeBoundingBox();
      halfWidth = Math.max(halfWidth, geometry.boundingBox?.max.x ?? 0);
    }
    if (kind) {
      const position = geometry.getAttribute('position');
      const uv = new Float32Array(position.count * 2);
      for (let i = 0; i < position.count; i++) {
        uv[i * 2] =
          kind === 'inner'
            ? (position.getX(i) + 7.89935) / 15.7987
            : (-0.23396 - position.getX(i)) / 7.73936;
        uv[i * 2 + 1] =
          kind === 'inner'
            ? (position.getY(i) + MODEL_DROP - 0.34562) / 11.1035
            : (position.getY(i) + MODEL_DROP - 0.27173) / 11.2513;
      }
      geometry.setAttribute('uv', new BufferAttribute(uv, 2));
    }
    if (moving || flexible) {
      material.onBeforeCompile = (shader) => {
        shader.uniforms.foldAngle = bend;
        if (kind) {
          Object.assign(shader.uniforms, screens[kind].uniforms);
          shader.fragmentShader = shader.fragmentShader
            .replace(
              '#include <emissivemap_pars_fragment>',
              `#include <emissivemap_pars_fragment>
              ${kind === 'inner' ? '#define INNER_UI' : ''}
              ${screenShader}`,
            )
            .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance *= screenColor();');
          shader.vertexShader = `varying vec3 vUIPosition;\n${shader.vertexShader}`.replace(
            '#include <project_vertex>',
            `vUIPosition = transformed;
            #include <project_vertex>`,
          );
        }
        shader.vertexShader = `${flexible ? '#define FLEXIBLE_SCREEN\n' : ''}${foldShader}\n${shader.vertexShader}`
          .replace(
            '#include <begin_vertex>',
            `vec2 folded = ${flexible ? 'bendStrip(position)' : 'rotateHinge(position.xz)'};
            vec3 transformed = vec3(folded.x, position.y, folded.y);`,
          )
          .replace(
            '#include <beginnormal_vertex>',
            `vec3 objectNormal = vec3(normal);
            float a = foldAngle${flexible ? ' * (1.0 - smoothstep(-1.6, 1.6, position.x))' : ''};
            objectNormal.x = cos(a) * normal.x + sin(a) * normal.z;
            objectNormal.z = -sin(a) * normal.x + cos(a) * normal.z;`,
          );
      };
      material.customProgramCacheKey = () => `${flexible ? 'fold-flexible' : 'fold-cover'}-${kind ?? 'body'}`;
    }
    const mesh = new Mesh(geometry, material);
    mesh.name = object.name;
    mesh.frustumCulled = false;
    root.add(mesh);
  });

  function light() {
    const lit = MathUtils.lerp(0.25, 1, MathUtils.smoothstep(openness, 0.02, 0.3));
    const glow = (dress) => (dress.dim ? 0.1 : lit);
    const { current, previous } = screens.inner;
    screens.inner.material.emissiveIntensity = previous
      ? MathUtils.lerp(glow(previous), glow(current), fade)
      : glow(current);
    screens.outer.material.emissiveIntensity = 1;
  }

  function sync() {
    for (const kind of ['inner', 'outer']) {
      const { current, previous, knobs } = screens[kind];
      knobs.settle.value = current.settled ? 0 : 1;
      knobs.parallax.value = current.fit ? 0 : viewAmount;
      knobs.previousSettle.value = previous?.settled ? 0 : 1;
      knobs.previousParallax.value = previous?.fit ? 0 : viewAmount;
      knobs.blend.value = previous ? fade : 1;
    }
    light();
  }

  function setOpenness(value) {
    openness = value;
    bend.value = (1 - value) * Math.PI;
    shut = 1 - value;
    dirty = true;
    root.position.x = (-halfWidth / 2) * (1 - value);
    light();
  }

  function dress() {
    const changed = new Set();
    for (const kind of ['inner', 'outer']) {
      const screen = screens[kind];
      const next = dressFor(kind);
      if (sameDress(next, screen.current)) continue;
      if (!screen.previous || fade >= 0.5) screen.previous = screen.current;
      screen.current = next;
      changed.add(kind);
    }
    if (changed.size === 0) return;
    for (const kind of ['inner', 'outer']) {
      if (!changed.has(kind) && fade >= 0.5) screens[kind].previous = null;
    }
    fade = 0;
    dirty = true;
    sync();
  }

  function setRoll(direction, panel = 'inner') {
    turn.inner = panel === 'inner' && direction ? direction : 'none';
    turn.outer = panel === 'outer' && direction ? direction : 'none';
    dress();
  }

  function setFocus(kind) {
    focus = kind;
    dress();
  }

  function setBlend(amount) {
    fade = MathUtils.clamp(amount, 0, 1);
    if (fade >= 1) {
      screens.inner.previous = null;
      screens.outer.previous = null;
      retired?.dispose();
      retired = null;
    }
    sync();
  }

  function advanceBlend(delta) {
    if (screens.inner.previous || screens.outer.previous) setBlend(fade + delta);
  }

  function paint(renderer, target, kind, look) {
    const screen = screens[kind];
    const panel = kind === 'inner' ? INNER_UI_FRAME : OUTER_UI_FRAME;
    for (const layer of LAYERS) {
      if (look.fit) layerFrame.copy(panel);
      else frameLayer(openness, LAYER_DEPTH[layer], layerFrame);
      frameWithin(panel, layerFrame, composed[layer]);
    }
    const swept = kind === 'inner' ? shut : Math.max(0, 1 - 2 * Math.abs(shut - 0.5)) / 2;
    target.render(
      renderer,
      kind,
      {
        backdrop: look.backdrop,
        backdropFrame: composed.mountain,
        landscape: look.layered
          ? {
              sky,
              skyFrame: composed.sky,
              mountain,
              mountainFrame: composed.mountain,
              duneFrame: composed.dune,
            }
          : null,
        clock: look.clock ? screen.plates : null,
      },
      look.settled ? 0 : swept,
    );
  }

  function render(renderer) {
    if (!dirty) return;
    dirty = false;
    for (const kind of ['inner', 'outer']) {
      const screen = screens[kind];
      paint(renderer, wipe, kind, screen.current);
      if (screen.previous) paint(renderer, previousWipe, kind, screen.previous);
    }
  }

  function setViewpoint(eye, amount) {
    referenceEye.value.copy(eye);
    viewAmount = amount;
    sync();
  }

  function swapImage(texture) {
    retired?.dispose();
    retired = customTexture;
    customTexture = texture;
    dress();
  }

  function showImage(image) {
    swapImage(createTexture(image, anisotropy));
  }

  function clearImage() {
    swapImage(null);
  }

  function setPanelImage(kind, image) {
    panelTextures[kind] = createTexture(image, anisotropy);
    dress();
  }

  return {
    root,
    setOpenness,
    setRoll,
    setFocus,
    setViewpoint,
    setBlend,
    advanceBlend,
    showImage,
    clearImage,
    setPanelImage,
    render,
    warmUp,
  };
}

export { loadLockScreen, loadPanelImage, loadStaticImage, paintCustomImage, loadModel, createFoldable };