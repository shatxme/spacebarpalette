export interface AdjustmentValues {
  h: number;  // Hue adjustment
  s: number;  // Saturation adjustment
  l: number;  // Lightness adjustment
  t: number;  // Temperature adjustment
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

  const generateColor = (hue: number) => {
    const constrainedHue = minHue + (hue - minHue) % (maxHue - minHue);
    let saturation = Math.max(50, Math.min(100, 100 - brightness / 2));
    let lightness = Math.max(30, Math.min(70, brightness)); // Ensure lightness is never too low or high

    // Add some randomness
    saturation += (Math.random() * 20 - 10);
    lightness += (Math.random() * 20 - 10);

    // Ensure values are within valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    lightness = Math.max(20, Math.min(80, lightness)); // Further restrict lightness range

    return { h: constrainedHue % 360, s: saturation, l: lightness };
  };

  const goldenRatio = 0.618033988749895;
  let hue = Math.random();
  for (let i = 0; i < count; i++) {
    if (lockedColors[i] && currentPalette[i]) {
      // Keep the locked color
      palette.push(currentPalette[i]);
    } else {
      // Generate a new color
      hue = (hue + goldenRatio) % 1;
      const newHue = minHue + hue * (maxHue - minHue);
      const { h, s, l } = generateColor(newHue);
      palette.push(hslToHex(h, s, l));
    }
  }

  return palette;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
}

// const isColorLight = (color: string): boolean => {
//     // ... function implementation ...
// };

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hexToCmyk(hex: string) {
  const { r, g, b } = hexToRgb(hex);
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

export function getColorName(hex: string): string {
  const colors: { [key: string]: string } = {
    '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue',
    '#FFFF00': 'Yellow', '#FF00FF': 'Magenta', '#00FFFF': 'Cyan',
    '#800000': 'Maroon', '#008000': 'Green', '#000080': 'Navy',
    '#808000': 'Olive', '#800080': 'Purple', '#008080': 'Teal',
    '#FFA500': 'Orange', '#FFC0CB': 'Pink', '#A52A2A': 'Brown',
    '#808080': 'Gray', '#FFFFFF': 'White', '#000000': 'Black'
  };

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  let minDistance = Infinity;
  let closestColor = '';

  for (const [colorHex, colorName] of Object.entries(colors)) {
    const cr = parseInt(colorHex.slice(1, 3), 16);
    const cg = parseInt(colorHex.slice(3, 5), 16);
    const cb = parseInt(colorHex.slice(5, 7), 16);

    const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorName;
    }
  }

  return closestColor;
}

export function adjustPaletteHSL(palette: string[], adjustments: AdjustmentValues): string[] {
  return palette.map(color => {
    let { h, s, l } = hexToHsl(color);

    // Apply hue adjustment
    h = (h + adjustments.h + 360) % 360;

    // Apply saturation adjustment
    s = Math.max(0, Math.min(100, s + adjustments.s));

    // Apply lightness adjustment
    l = Math.max(0, Math.min(100, l + adjustments.l));

    // Apply temperature adjustment
    const tempShift = adjustments.t * 0.6; // Scale -100 to 100 to -60 to 60 degree shift
    h = (h + tempShift + 360) % 360;

    return hslToHex(h, s, l);
  });
}
