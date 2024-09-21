import { exportToJSON } from '../shareUtils';
// We're not using these imports, so we can remove them
// import { sharePalette } from '../shareUtils';
// import { AdjustmentValues } from '../colorUtils';

jest.mock('html2canvas', () => jest.fn());
jest.mock('jspdf', () => jest.fn());

// Mock the global URL.createObjectURL and navigator.clipboard
global.URL.createObjectURL = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('shareUtils', () => {
  describe('exportToJSON', () => {
    it('creates a JSON file with correct data', () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      // Mock document.createElement and link.click
      const mockLink = { click: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      global.URL.createObjectURL = jest.fn();

      exportToJSON(mockPalette, mockAdjustments);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});