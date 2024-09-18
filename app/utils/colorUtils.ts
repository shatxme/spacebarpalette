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
    let saturation = Math.max(20, Math.min(100, 100 - brightness/2 + (Math.random() * 20 - 10)));
    
    // Calculate base lightness
    let baseLightness = brightness;
    
    // Introduce variation to lightness
    let lightnessVariation = Math.random() * 50 - 25; // -25 to +25
    let lightness = Math.max(0, Math.min(100, baseLightness + lightnessVariation));

    // Chance to produce very dark colors regardless of brightness
    if (Math.random() < 0.15) { // 15% chance for darker color
      lightness = Math.max(0, lightness - 50);
      saturation = Math.max(0, saturation - 20);
    }

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

