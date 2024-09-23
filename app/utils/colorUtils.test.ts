import { getContrastColor, hexToRgb } from './colorUtils';

describe('getContrastColor', () => {
  test('returns white for dark colors', () => {
    expect(getContrastColor('#000000')).toBe('#FFFFFF');
    expect(getContrastColor('#123456')).toBe('#FFFFFF');
    expect(getContrastColor('#660000')).toBe('#FFFFFF');
  });

  test('returns black for light colors', () => {
    expect(getContrastColor('#FFFFFF')).toBe('#000000');
    expect(getContrastColor('#FFFF00')).toBe('#000000');
    expect(getContrastColor('#00FF00')).toBe('#000000');
  });

  test('handles edge cases correctly', () => {
    expect(getContrastColor('#808080')).toBe('#FFFFFF'); // Medium gray
    expect(getContrastColor('#C0C0C0')).toBe('#000000'); // Light gray
  });

  test('returns white for your specific example', () => {
    expect(getContrastColor('#bd3efe')).toBe('#FFFFFF');
  });
});

// Additional tests for helper functions

describe('hexToRgb', () => {
  test('converts hex to RGB correctly', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
  });
});

// Remove the getLuminance test as it's not exported from colorUtils