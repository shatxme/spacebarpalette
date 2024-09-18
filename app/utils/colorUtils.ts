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

  const generateColor = (hue: number) => {
    // Constrain hue to the specified range
    const constrainedHue = minHue + (hue - minHue) % (maxHue - minHue);
    
    // Adjust saturation based on brightness
    let saturation = Math.max(20, Math.min(100, 100 - brightness / 2));
    
    // Calculate lightness based on brightness
    let lightness = brightness;

    // Chance to produce very dark colors regardless of brightness
    if (Math.random() < 0.15) { // 15% chance for darker color
      lightness = Math.max(0, lightness - 30);
      saturation = Math.min(100, saturation + 20);
    }

    // Add some randomness to saturation and lightness
    saturation += (Math.random() * 20 - 10);
    lightness += (Math.random() * 20 - 10);

    // Ensure values are within valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    lightness = Math.max(0, Math.min(100, lightness));

    return hslToHex(constrainedHue % 360, saturation, lightness);
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
      palette.push(generateColor(newHue));
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
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

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
