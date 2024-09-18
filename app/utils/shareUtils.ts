export function generateShareableUrl(palette: string[], lockedColors: boolean[]): string {
  const paletteData = palette.map((color, index) => ({
    color,
    locked: lockedColors[index]
  }));
  const encodedData = btoa(JSON.stringify(paletteData));
  return `${window.location.origin}?shared=${encodedData}`;
}
