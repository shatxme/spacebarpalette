function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function generatePalette(count: number, brightness: number, hueRange: number[]): string[] {
  const palette: string[] = []
  const [minHue, maxHue] = hueRange

  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * (maxHue - minHue + 1)) + minHue
    const saturation = Math.floor(Math.random() * 61) + 40 // 40-100
    const lightness = Math.floor((brightness / 100) * 60) + 20 // 20-80
    palette.push(hslToHex(hue, saturation, lightness))
  }

  return palette
}
