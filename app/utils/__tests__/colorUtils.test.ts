import { hexToRgb, hexToCmyk, getContrastColor } from '../colorUtils';

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('converts hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });
  });

  describe('hexToCmyk', () => {
    it('converts hex to CMYK correctly', () => {
      expect(hexToCmyk('#FF0000')).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(hexToCmyk('#00FF00')).toEqual({ c: 100, m: 0, y: 100, k: 0 });
      expect(hexToCmyk('#0000FF')).toEqual({ c: 100, m: 100, y: 0, k: 0 });
    });
  });

  describe('getContrastColor', () => {
    it('returns white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#FFFFFF');
      expect(getContrastColor('#123456')).toBe('#FFFFFF');
    });

    it('returns black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000');
      expect(getContrastColor('#FFFF00')).toBe('#000000');
    });
  });
});