export interface AdjustmentValues {
  h: number;  // Hue adjustment
  s: number;  // Saturation adjustment
  b: number;  // Brightness adjustment
  t: number;  // Temperature adjustment
}

const GOLDEN_RATIO = 0.618033988749895;

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

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getComplementaryHue(hue: number): number {
  return (hue + 180) % 360;
}

function getAnalogousHues(hue: number): [number, number] {
  return [(hue - 30 + 360) % 360, (hue + 30) % 360];
}

function getTriadicHues(hue: number): [number, number] {
  return [(hue + 120) % 360, (hue + 240) % 360];
}

function getSplitComplementaryHues(hue: number): [number, number] {
  const complement = getComplementaryHue(hue);
  return [(complement - 30 + 360) % 360, (complement + 30) % 360];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureSufficientContrast(palette: string[]): string[] {
  const whiteContrast = palette.map(color => getContrastRatio(color, '#FFFFFF'));
  const blackContrast = palette.map(color => getContrastRatio(color, '#000000'));
  
  const hasGoodWhiteContrast = whiteContrast.some(ratio => ratio >= 4.5);
  const hasGoodBlackContrast = blackContrast.some(ratio => ratio >= 4.5);

  if (hasGoodWhiteContrast && hasGoodBlackContrast) {
    return palette;
  }

  // If we don't have good contrast, adjust the lightness of one color
  const indexToAdjust = whiteContrast.findIndex((ratio, index) => 
    ratio < 4.5 && blackContrast[index] < 4.5
  );

  if (indexToAdjust !== -1) {
    const { h, s, l } = hexToHsl(palette[indexToAdjust]);
    const newL = l > 50 ? Math.min(l + 20, 100) : Math.max(l - 20, 0);
    palette[indexToAdjust] = hslToHex(h, s, newL);
  }

  return palette;
}

export function generatePalette(
  count: number,
  brightness: number,
  hueRange: [number, number],
  currentPalette: string[] = [],
  lockedColors: boolean[] = []
): string[] {
  let palette: string[] = [];
  const [minHue, maxHue] = hueRange;

  const generateColor = (hue: number, isAccent: boolean = false, isNeutral: boolean = false) => {
    let saturation: number;
    let lightness: number;

    if (isNeutral) {
      saturation = getRandomInt(0, 10);
      lightness = getRandomInt(10, 90);
    } else if (isAccent) {
      saturation = getRandomInt(80, 100);
      lightness = getRandomInt(40, 60);
    } else {
      saturation = getRandomInt(40, 80);
      const minBrightness = Math.max(30, brightness - 20);
      const maxBrightness = Math.min(70, brightness + 20);
      lightness = getRandomInt(minBrightness, maxBrightness);
    }

    return { h: hue, s: saturation, l: lightness };
  };

  // Use golden ratio to determine the base hue
  let baseHue = getRandomInt(minHue, maxHue);
  baseHue = (baseHue + GOLDEN_RATIO * 360) % 360;

  const harmonyType = getRandomInt(0, 3); // Randomly select a harmony type

  let harmonicHues: number[];
  switch (harmonyType) {
    case 0: // Complementary
      harmonicHues = [baseHue, getComplementaryHue(baseHue)];
      break;
    case 1: // Analogous
      harmonicHues = [baseHue, ...getAnalogousHues(baseHue)];
      break;
    case 2: // Triadic
      harmonicHues = [baseHue, ...getTriadicHues(baseHue)];
      break;
    case 3: // Split-complementary
      harmonicHues = [baseHue, ...getSplitComplementaryHues(baseHue)];
      break;
    default:
      harmonicHues = [baseHue];
  }

  const accentIndex = getRandomInt(0, count - 1);
  const neutralIndex = (accentIndex + getRandomInt(1, count - 1)) % count;

  for (let i = 0; i < count; i++) {
    if (lockedColors[i] && currentPalette[i]) {
      palette.push(currentPalette[i]);
    } else {
      const hue = (harmonicHues[i % harmonicHues.length] + i * GOLDEN_RATIO * 360) % 360;
      const isAccent = i === accentIndex;
      const isNeutral = i === neutralIndex;
      const { h, s, l } = generateColor(hue, isAccent, isNeutral);
      palette.push(hslToHex(h, s, l));
    }
  }

  // Ensure sufficient contrast
  palette = ensureSufficientContrast(palette);

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
    h = (h + adjustments.h * 2 + 360) % 360;

    // Apply saturation adjustment
    s = Math.max(0, Math.min(100, s + adjustments.s));

    // Apply brightness adjustment
    const brightnessAdjustment = adjustments.b / 100; // Convert to a scale of -1 to 1
    if (brightnessAdjustment > 0) {
      l = l + (100 - l) * brightnessAdjustment;
    } else {
      l = l + l * brightnessAdjustment;
    }
    l = Math.max(0, Math.min(100, l));

    // Apply temperature adjustment
    const tempShift = adjustments.t * 0.6; // Scale -100 to 100 to -60 to 60 degree shift
    h = (h + tempShift + 360) % 360;

    return hslToHex(h, s, l);
  });
}

// Add these new types and functions at the end of the file

export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  const rgb = hexToRgb(hex);
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Convert to LMS color space
  let l = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
  let m = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
  let s = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);

  // Simulate color blindness
  switch (type) {
    case 'protanopia':
      l = 0.0 * l + 2.02344 * m + -2.52581 * s;
      m = 0.0 * l + 1.0 * m + 0.0 * s;
      s = 0.0 * l + 0.0 * m + 1.0 * s;
      break;
    case 'deuteranopia':
      l = 1.0 * l + 0.0 * m + 0.0 * s;
      m = 0.494207 * l + 0.0 * m + 1.24827 * s;
      s = 0.0 * l + 0.0 * m + 1.0 * s;
      break;
    case 'tritanopia':
      l = 1.0 * l + 0.0 * m + 0.0 * s;
      m = 0.0 * l + 1.0 * m + 0.0 * s;
      s = -0.395913 * l + 0.801109 * m + 0.0 * s;
      break;
    case 'achromatopsia':
      // Convert to grayscale
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      return `#${Math.round(gray * 255).toString(16).padStart(2, '0').repeat(3)}`;
  }

  // Convert back to RGB
  r = Math.max(0, Math.min(1, (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s)));
  g = Math.max(0, Math.min(1, (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s)));
  b = Math.max(0, Math.min(1, (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s)));

  // Convert back to hex
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function simulatePaletteColorBlindness(palette: string[], type: ColorBlindnessType): string[] {
  return palette.map(color => simulateColorBlindness(color, type));
}
