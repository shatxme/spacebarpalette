import { hexToHsl } from './colorUtils';

function getRandomHue(): number {
  return Math.floor(Math.random() * 360);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateNeutralColor(lightness: number): string {
  return hslToHex(0, 0, lightness);
}

function getComplementaryHue(hue: number): number {
  return (hue + 180) % 360;
}

function getAnalogousHues(hue: number): [number, number] {
  return [(hue + 30) % 360, (hue + 330) % 360];
}

function getTriadicHues(hue: number): [number, number] {
  return [(hue + 120) % 360, (hue + 240) % 360];
}

export function generatePalette(numColors: number): string[] {
  const palette: string[] = [];
  
  // Always add a near-white color
  palette.push(hslToHex(0, 0, 95)); // Very light gray, almost white

  // Always add a near-black color
  palette.push(hslToHex(0, 0, 10)); // Very dark gray, almost black

  // Generate remaining vibrant colors
  const remainingColors = numColors - 2;
  if (remainingColors > 0) {
    const baseHue = getRandomHue();
    
    for (let i = 0; i < remainingColors; i++) {
      let hue, saturation, lightness;
      
      if (i === 0) {
        hue = baseHue;
      } else if (i === 1) {
        hue = getComplementaryHue(baseHue);
      } else {
        const [analogous1, analogous2] = getAnalogousHues(baseHue);
        hue = i % 2 === 0 ? analogous1 : analogous2;
      }
      
      saturation = 70 + Math.random() * 20; // 70-90%
      lightness = 45 + Math.random() * 20; // 45-65%
      
      palette.push(hslToHex(hue, saturation, lightness));
    }
  }

  return palette;
}

function adjustSaturation(color: string, amount: number): string {
  const { h, s, l } = hexToHsl(color);
  return hslToHex(h, Math.min(100, Math.max(0, s + amount)), l);
}

function getComplementaryColor(color: string): string {
  const { h, s, l } = hexToHsl(color);
  return hslToHex((h + 180) % 360, s, l);
}
