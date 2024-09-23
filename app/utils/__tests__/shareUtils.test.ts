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

  describe('exportToPNG', () => {
    it('exports the palette to a PNG file', async () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      const mockCanvas = {
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
      };
      (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

      const link = { click: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValue(link as unknown as HTMLAnchorElement);

      await exportToPNG(mockPalette, mockAdjustments);

      expect(html2canvas).toHaveBeenCalled();
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(link.click).toHaveBeenCalled();
    });
  });

  describe('exportToPDF', () => {
    it('exports the palette to a PDF file', async () => {
      const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
      const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };

      const mockCanvas = {
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
      };
      (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

      const mockPDF = {
        addImage: jest.fn(),
        save: jest.fn(),
      };
      (jsPDF as unknown as jest.Mock).mockReturnValue(mockPDF);

      await exportToPDF(mockPalette, mockAdjustments);

      expect(html2canvas).toHaveBeenCalled();
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
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