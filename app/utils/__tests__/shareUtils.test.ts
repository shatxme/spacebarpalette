import { exportToPNG, exportToPDF, exportToJSON, sharePalette } from '../shareUtils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

jest.mock('html2canvas', () => jest.fn());
jest.mock('jspdf', () => jest.fn().mockImplementation(() => ({
  addImage: jest.fn(),
  save: jest.fn(),
})));

// Mock the global URL.createObjectURL and navigator.clipboard
global.URL.createObjectURL = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock window.alert
global.alert = jest.fn();

// Mock window object
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost',
  },
});

describe('shareUtils', () => {
  let mockLink: { click: jest.Mock; href: string; download: string };

  beforeEach(() => {
    jest.clearAllMocks();

    mockLink = { click: jest.fn(), href: '', download: '' };

    // Mock document.createElement
    document.createElement = jest.fn().mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          style: {},
          getContext: jest.fn(),
          toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
        } as unknown as HTMLCanvasElement;
      }
      if (tagName === 'a') {
        return mockLink as unknown as HTMLAnchorElement;
      }
      return {
        style: {},
        appendChild: jest.fn(),
      } as unknown as HTMLElement;
    });

    // Mock document.body
    Object.defineProperty(document, 'body', {
      value: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  describe('exportToJSON', () => {
    it('creates a JSON file with correct data', () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      exportToJSON(mockPalette, mockAdjustments);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToPNG', () => {
    it('exports the palette to a PNG file', async () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      (html2canvas as jest.Mock).mockResolvedValue({
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
      });

      await exportToPNG(mockPalette, mockAdjustments);

      expect(html2canvas).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToPDF', () => {
    it('exports the palette to a PDF file', async () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      (html2canvas as jest.Mock).mockResolvedValue({
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
        width: 1200,
        height: 600,
      });

      const mockPDF = {
        addImage: jest.fn(),
        save: jest.fn(),
      };
      (jsPDF as unknown as jest.Mock).mockReturnValue(mockPDF);

      await exportToPDF(mockPalette, mockAdjustments);

      expect(html2canvas).toHaveBeenCalled();
      expect(mockPDF.addImage).toHaveBeenCalled();
      expect(mockPDF.save).toHaveBeenCalled();
    });
  });

  describe('sharePalette', () => {
    it('copies the share link to the clipboard', async () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockLockedColors = [false, false, false];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      await sharePalette(mockPalette, mockLockedColors, mockAdjustments);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Share link copied to clipboard!');
    });
  });
});
