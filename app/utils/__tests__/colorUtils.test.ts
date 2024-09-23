import { hexToRgb, hexToCmyk, getContrastColor, generatePalette, getComplementaryHue, getAnalogousHues, getTriadicHues, getSplitComplementaryHues } from '../colorUtils';

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
      expect(getContrastColor('#660000')).toBe('#FFFFFF');
      expect(getContrastColor('#808080')).toBe('#FFFFFF'); // Medium gray
    });

    it('returns black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000');
      expect(getContrastColor('#FFFF00')).toBe('#000000');
      expect(getContrastColor('#00FF00')).toBe('#000000');
      expect(getContrastColor('#C0C0C0')).toBe('#000000'); // Light gray
    });

    it('handles specific vibrant colors correctly', () => {
      expect(getContrastColor('#bd3efe')).toBe('#FFFFFF');
      expect(getContrastColor('#00FFFF')).toBe('#000000'); // Cyan
      expect(getContrastColor('#FF00FF')).toBe('#FFFFFF'); // Magenta
    });

    it('handles edge cases correctly', () => {
      expect(getContrastColor('#808080')).toBe('#FFFFFF'); // Medium gray
      expect(getContrastColor('#909090')).toBe('#000000'); // Slightly lighter than medium gray
    });
  });

  describe('generatePalette', () => {
    it('should generate a palette with default parameters', () => {
      const result = generatePalette(5, 50, [0, 360]);
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should generate a palette with different brightness', () => {
      const result = generatePalette(5, 70, [0, 360]);
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should generate a palette with different hue range', () => {
      const result = generatePalette(5, 50, [180, 240]);
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should handle edge cases', () => {
      const result = generatePalette(0, 50, [0, 360]);
      expect(result).toEqual([]);
    });
  });

  describe('getComplementaryHue', () => {
    it('returns the correct complementary hue', () => {
      expect(getComplementaryHue(0)).toBe(180);
      expect(getComplementaryHue(180)).toBe(0);
      expect(getComplementaryHue(90)).toBe(270);
      expect(getComplementaryHue(270)).toBe(90);
    });
  });

  describe('getAnalogousHues', () => {
    it('returns the correct analogous hues', () => {
      expect(getAnalogousHues(0)).toEqual([330, 30]);
      expect(getAnalogousHues(180)).toEqual([150, 210]);
      expect(getAnalogousHues(90)).toEqual([60, 120]);
      expect(getAnalogousHues(270)).toEqual([240, 300]);
    });
  });

  describe('getTriadicHues', () => {
    it('returns the correct triadic hues', () => {
      expect(getTriadicHues(0)).toEqual([120, 240]);
      expect(getTriadicHues(180)).toEqual([300, 60]);
      expect(getTriadicHues(90)).toEqual([210, 330]);
      expect(getTriadicHues(270)).toEqual([30, 150]);
    });
  });

  describe('getSplitComplementaryHues', () => {
    it('returns the correct split complementary hues', () => {
      expect(getSplitComplementaryHues(0)).toEqual([150, 210]);
      expect(getSplitComplementaryHues(180)).toEqual([330, 30]);
      expect(getSplitComplementaryHues(90)).toEqual([240, 300]);
      expect(getSplitComplementaryHues(270)).toEqual([60, 120]);
    });
  });
});