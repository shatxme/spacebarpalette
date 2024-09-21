import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

// Add this mock for ColorDetailsModal
jest.mock('../../components/ColorDetailsModal', () => {
  return function DummyColorDetailsModal({ isOpen }: { isOpen: boolean }) {
    return isOpen ? <div data-testid="color-details-modal">Color Details</div> : null;
  };
});

// Mock the necessary modules
jest.mock('../utils/colorUtils', () => ({
  generatePalette: jest.fn(() => ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']),
  adjustPaletteHSL: jest.fn((colors) => colors),
  simulatePaletteColorBlindness: jest.fn((colors) => colors),
  getContrastColor: jest.fn(() => '#FFFFFF'),
  hexToRgb: jest.fn(() => ({ r: 255, g: 0, b: 0 })),
  hexToCmyk: jest.fn(() => ({ c: 0, m: 100, y: 100, k: 0 })),
  hexToHsl: jest.fn(() => ({ h: 0, s: 100, l: 50 })),
  hslToHex: jest.fn(() => '#FF0000'),
}));

jest.mock('../utils/shareUtils', () => ({
  exportToPNG: jest.fn(),
  exportToJSON: jest.fn(),
  exportToPDF: jest.fn(),
  sharePalette: jest.fn(),
}));

describe('Home', () => {
  it('renders without crashing', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Spacebar Palette')).toBeInTheDocument();
      expect(screen.getAllByTestId('color-element')).toHaveLength(5);
    });
  });

  it('generates a new palette on spacebar press', async () => {
    render(<Home />);
    fireEvent.keyDown(document, { code: 'Space' });
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /lock color|unlock color/i })).toHaveLength(5);
    });
  });

  it('opens color details modal when a color is clicked', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByTestId('color-element')).toHaveLength(5);
    });
    const colorElements = screen.getAllByTestId('color-element');
    fireEvent.click(colorElements[0]);
    expect(await screen.findByTestId('color-details-modal')).toBeInTheDocument();
  });

  it('toggles lock state when lock button is clicked', async () => {
    render(<Home />);
    await waitFor(() => {
      const lockButtons = screen.getAllByRole('button', { name: /lock color|unlock color/i });
      fireEvent.click(lockButtons[0]);
    });
    const updatedLockButtons = await screen.findAllByRole('button', { name: /lock color|unlock color/i });
    expect(updatedLockButtons[0]).toHaveAttribute('aria-label', 'Unlock color');
  });

  it('opens share options', async () => {
    render(<Home />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Share'));
    });
    await waitFor(() => {
      expect(screen.getByText('Export PNG')).toBeInTheDocument();
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
      expect(screen.getByText('Export JSON')).toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });
  });

  // Add more tests as needed
});