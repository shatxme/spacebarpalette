export function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function generatePalette(
  count: number,
  brightness: number,
  hueRange: number[],
  currentPalette: string[] = [],
  lockedColors: boolean[] = []
): string[] {
  const palette: string[] = [];
  const [minHue, maxHue] = hueRange;
  const baseHue = minHue + Math.random() * (maxHue - minHue);

  const generateColor = (hue: number, index: number) => {
    let saturation = 70 + Math.random() * 30; // 70-100
    let lightness = 40 + (brightness / 100) * 20; // 40-60

    // Randomly decide to make this color very dark or very light
    const rand = Math.random();
    if (rand < 0.15) { // 15% chance for very dark color
      lightness = 10 + Math.random() * 10; // 10-20
      saturation = 0 + Math.random() * 20; // 0-20
    } else if (rand > 0.85) { // 15% chance for very light color
      lightness = 90 + Math.random() * 10; // 90-100
      saturation = 0 + Math.random() * 20; // 0-20
    }

    return hslToHex(hue % 360, saturation, lightness);
  };

  for (let i = 0; i < count; i++) {
    if (lockedColors[i] && currentPalette[i]) {
      palette.push(currentPalette[i]);
    } else {
      const hueOffset = i * (360 / count); // Distribute colors evenly
      const hue = baseHue + hueOffset;
      palette.push(generateColor(hue, i));
    }
  }

  // Ensure at least one very dark and one very light color
  let hasDark = palette.some(color => isColorDark(color));
  let hasLight = palette.some(color => isColorLight(color));

  if (!hasDark || !hasLight) {
    const indexToReplace = Math.floor(Math.random() * count);
    if (!hasDark) {
      palette[indexToReplace] = hslToHex(baseHue, 10, 10); // Very dark
    } else {
      palette[indexToReplace] = hslToHex(baseHue, 10, 95); // Very light
    }
  }

  return palette;
}

function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
}

function isColorLight(hex: string): boolean {
  return !isColorDark(hex);
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let { r, g, b } = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h! /= 6;
  }

  return { h: Math.round(h! * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToCmyk(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);

  c = Math.round(((c - k) / (1 - k)) * 100) || 0;
  m = Math.round(((m - k) / (1 - k)) * 100) || 0;
  y = Math.round(((y - k) / (1 - k)) * 100) || 0;
  k = Math.round(k * 100);

  return { c, m, y, k };
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}
