import * as THREE from 'three';

export type MaterialType =
  | 'hardwood'
  | 'marble'
  | 'tile'
  | 'brick'
  | 'carpet'
  | 'concrete'
  | 'parquet'
  | 'stone'
  | 'solid'; // fallback = solid color

export interface MaterialDef {
  id: MaterialType;
  label: string;
  emoji: string;
  description: string;
  /** Suitable for floors, walls, or both */
  surfaces: ('floor' | 'wall')[];
  roughness: number;
  metalness: number;
}

export const MATERIAL_LIBRARY: MaterialDef[] = [
  { id: 'solid', label: 'Solid Color', emoji: '🎨', description: 'Plain color', surfaces: ['floor', 'wall'], roughness: 0.8, metalness: 0 },
  { id: 'hardwood', label: 'Hardwood', emoji: '🪵', description: 'Classic wood planks', surfaces: ['floor'], roughness: 0.75, metalness: 0.0 },
  { id: 'parquet', label: 'Parquet', emoji: '🟫', description: 'Herringbone pattern', surfaces: ['floor'], roughness: 0.7, metalness: 0.0 },
  { id: 'marble', label: 'Marble', emoji: '🤍', description: 'Polished stone', surfaces: ['floor', 'wall'], roughness: 0.15, metalness: 0.1 },
  { id: 'tile', label: 'Ceramic Tile', emoji: '🔲', description: 'Grid tile pattern', surfaces: ['floor', 'wall'], roughness: 0.2, metalness: 0.05 },
  { id: 'brick', label: 'Brick', emoji: '🧱', description: 'Exposed brick', surfaces: ['wall'], roughness: 0.9, metalness: 0.0 },
  { id: 'carpet', label: 'Carpet', emoji: '🟩', description: 'Soft woven fiber', surfaces: ['floor'], roughness: 1.0, metalness: 0.0 },
  { id: 'concrete', label: 'Concrete', emoji: '⬜', description: 'Raw concrete', surfaces: ['floor', 'wall'], roughness: 0.95, metalness: 0.0 },
  { id: 'stone', label: 'Natural Stone', emoji: '🪨', description: 'Rough-cut stone', surfaces: ['wall'], roughness: 0.85, metalness: 0.0 },
];

// Cache generated textures to avoid recreating them
const textureCache = new Map<string, THREE.CanvasTexture>();

function getCacheKey(type: MaterialType, color: string, tileX: number, tileY: number): string {
  return `${type}-${color}-${tileX}-${tileY}`;
}

/**
 * Generate a procedural canvas texture for a given material type.
 */
export function createProceduralTexture(
  type: MaterialType,
  baseColor: string,
  repeatX = 4,
  repeatY = 4,
): THREE.CanvasTexture | null {
  if (type === 'solid') return null;

  const key = getCacheKey(type, baseColor, repeatX, repeatY);
  if (textureCache.has(key)) return textureCache.get(key)!;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Parse base color
  const c = new THREE.Color(baseColor);
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);

  switch (type) {
    case 'hardwood':
      drawHardwood(ctx, size, r, g, b);
      break;
    case 'parquet':
      drawParquet(ctx, size, r, g, b);
      break;
    case 'marble':
      drawMarble(ctx, size, r, g, b);
      break;
    case 'tile':
      drawTile(ctx, size, r, g, b);
      break;
    case 'brick':
      drawBrick(ctx, size, r, g, b);
      break;
    case 'carpet':
      drawCarpet(ctx, size, r, g, b);
      break;
    case 'concrete':
      drawConcrete(ctx, size, r, g, b);
      break;
    case 'stone':
      drawStone(ctx, size, r, g, b);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;

  textureCache.set(key, texture);
  return texture;
}

// ── Drawing helpers ──

function drawHardwood(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, s, s);
  const plankH = s / 6;
  for (let i = 0; i < 6; i++) {
    const y = i * plankH;
    const variation = Math.random() * 20 - 10;
    ctx.fillStyle = `rgb(${clamp(r + variation)},${clamp(g + variation - 5)},${clamp(b + variation - 10)})`;
    ctx.fillRect(0, y, s, plankH - 1);
    // grain lines
    ctx.strokeStyle = `rgba(0,0,0,0.06)`;
    ctx.lineWidth = 0.5;
    for (let l = 0; l < 8; l++) {
      const gy = y + Math.random() * plankH;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(s * 0.3, gy + Math.random() * 3, s * 0.7, gy - Math.random() * 3, s, gy);
      ctx.stroke();
    }
    // gap
    ctx.fillStyle = `rgba(0,0,0,0.15)`;
    ctx.fillRect(0, y + plankH - 1, s, 1);
  }
}

function drawParquet(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, s, s);
  const unit = s / 8;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const variation = Math.random() * 25 - 12;
      ctx.fillStyle = `rgb(${clamp(r + variation)},${clamp(g + variation)},${clamp(b + variation - 8)})`;
      const x = col * unit;
      const y = row * unit;
      if ((row + col) % 2 === 0) {
        ctx.fillRect(x + 1, y + 1, unit - 2, unit / 2 - 1);
        ctx.fillStyle = `rgb(${clamp(r + variation + 10)},${clamp(g + variation + 5)},${clamp(b + variation)})`;
        ctx.fillRect(x + 1, y + unit / 2, unit - 2, unit / 2 - 1);
      } else {
        ctx.fillRect(x + 1, y + 1, unit / 2 - 1, unit - 2);
        ctx.fillStyle = `rgb(${clamp(r + variation + 10)},${clamp(g + variation + 5)},${clamp(b + variation)})`;
        ctx.fillRect(x + unit / 2, y + 1, unit / 2 - 1, unit - 2);
      }
    }
  }
}

function drawMarble(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, s, s);
  // veins
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = `rgb(${clamp(r - 40)},${clamp(g - 40)},${clamp(b - 30)})`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    const startX = Math.random() * s;
    const startY = Math.random() * s;
    ctx.moveTo(startX, startY);
    for (let j = 0; j < 5; j++) {
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * s * 0.8,
        startY + (Math.random() - 0.5) * s * 0.8,
        Math.random() * s,
        Math.random() * s
      );
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawTile(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  const tiles = 4;
  const tSize = s / tiles;
  const grout = 3;
  ctx.fillStyle = `rgb(${clamp(r - 30)},${clamp(g - 30)},${clamp(b - 30)})`;
  ctx.fillRect(0, 0, s, s);
  for (let row = 0; row < tiles; row++) {
    for (let col = 0; col < tiles; col++) {
      const v = Math.random() * 10 - 5;
      ctx.fillStyle = `rgb(${clamp(r + v)},${clamp(g + v)},${clamp(b + v)})`;
      ctx.fillRect(col * tSize + grout, row * tSize + grout, tSize - grout * 2, tSize - grout * 2);
    }
  }
}

function drawBrick(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${clamp(r - 40)},${clamp(g - 40)},${clamp(b - 40)})`;
  ctx.fillRect(0, 0, s, s); // mortar
  const brickH = s / 6;
  const brickW = s / 3;
  for (let row = 0; row < 6; row++) {
    const offset = row % 2 === 0 ? 0 : brickW / 2;
    for (let col = -1; col < 4; col++) {
      const v = Math.random() * 20 - 10;
      ctx.fillStyle = `rgb(${clamp(r + v)},${clamp(g + v - 5)},${clamp(b + v - 10)})`;
      ctx.fillRect(col * brickW + offset + 2, row * brickH + 2, brickW - 4, brickH - 4);
    }
  }
}

function drawCarpet(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, s, s);
  // fiber noise
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const v = Math.random() * 15 - 7;
    ctx.fillStyle = `rgba(${clamp(r + v)},${clamp(g + v)},${clamp(b + v)},0.4)`;
    ctx.fillRect(x, y, 1, 2);
  }
}

function drawConcrete(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const v = Math.random() * 20 - 10;
    ctx.fillStyle = `rgba(${clamp(r + v)},${clamp(g + v)},${clamp(b + v)},0.3)`;
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }
}

function drawStone(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${clamp(r - 20)},${clamp(g - 20)},${clamp(b - 20)})`;
  ctx.fillRect(0, 0, s, s); // mortar
  // irregular stone shapes
  for (let i = 0; i < 12; i++) {
    const cx = Math.random() * s;
    const cy = Math.random() * s;
    const v = Math.random() * 30 - 15;
    ctx.fillStyle = `rgb(${clamp(r + v)},${clamp(g + v)},${clamp(b + v)})`;
    ctx.beginPath();
    const pts = 6 + Math.floor(Math.random() * 4);
    const rad = s / 6 + Math.random() * (s / 8);
    for (let j = 0; j < pts; j++) {
      const a = (j / pts) * Math.PI * 2;
      const rr = rad * (0.7 + Math.random() * 0.3);
      const px = cx + Math.cos(a) * rr;
      const py = cy + Math.sin(a) * rr;
      j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
