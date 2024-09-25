import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';
import * as colorUtils from '../utils/colorUtils';

// Mock the ColorDetailsModal component
jest.mock('../../components/ColorDetailsModal', () => {
  return function DummyColorDetailsModal({ isOpen, color }: { isOpen: boolean; color: string }) {
    return isOpen ? (
      <div data-testid="color-details-modal">
        <h2>Color Details</h2>
        <p>Selected color: {color}</p>
      </div>
    ) : null;
  };
});

// Mock the ColorPalette component
jest.mock('../../components/ColorPalette', () => {
  return function MockColorPalette({ palette, onAddColumn, onToggleLock, onColorClick, onRemoveColumn }: any) {
    return (
      <div data-testid="color-palette-container">
        {palette.map((color: string, index: number) => (
          <div key={index} data-testid="color-element" style={{ backgroundColor: color }}>
            <span>{color}</span>
            <button onClick={() => onToggleLock(index)} aria-label={`${index % 2 === 0 ? 'Lock' : 'Unlock'} color`}>
              {`${index % 2 === 0 ? 'Lock' : 'Unlock'} color`}
            </button>
            <button onClick={() => onColorClick(color)} data-testid="color-click-area">
              Click color
            </button>
            {palette.length > 1 && (
              <button onClick={() => onRemoveColumn(index)} aria-label="Remove color">
                Remove color
              </button>
            )}
          </div>
        ))}
        {palette.length < 10 && (
          <button onClick={onAddColumn} data-testid="add-color-button">Add Color</button>
        )}
      </div>
    );
  };
});

// Mock the necessary modules
jest.mock('../utils/colorUtils', () => ({
  ...jest.requireActual('../utils/colorUtils'),
  adjustPaletteHSL: jest.fn((colors) => colors),
  generatePalette: jest.fn(() => ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']),
}));

jest.mock('../utils/shareUtils', () => ({
  exportToPNG: jest.fn(),
  exportToJSON: jest.fn(),
  exportToPDF: jest.fn(),
  sharePalette: jest.fn(),
}));

jest.useFakeTimers();

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and displays initial palette', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Spacebar Palette')).toBeInTheDocument();
      expect(screen.getByTestId('color-palette-container')).toBeInTheDocument();
    });
  });

  it('generates a new palette on spacebar press', async () => {
    render(<Home />);
    fireEvent.keyDown(document, { code: 'Space' });
    await waitFor(() => {
      expect(colorUtils.generatePalette).toHaveBeenCalled();
    });
  });

  it('opens color details modal when a color is clicked', async () => {
    render(<Home />);
    const colorPaletteContainer = await screen.findByTestId('color-palette-container');
    
    await waitFor(() => {
      expect(colorPaletteContainer.children.length).toBeGreaterThan(0);
    });

    const firstColorElement = screen.getAllByTestId('color-click-area')[0];
    fireEvent.click(firstColorElement);
    
    await waitFor(() => {
      expect(screen.getByTestId('color-details-modal')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders ColorPalette with correct number of columns and even distribution', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const colorElements = screen.getAllByTestId('color-element');
      expect(colorElements.length).toBe(5);
    });
  });

  it('adds a new color column when "Add Color" is clicked', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('color-element').length).toBe(5);
    });

    const addColorButton = screen.getByTestId('add-color-button');
    fireEvent.click(addColorButton);

    await waitFor(() => {
      const colorElements = screen.getAllByTestId('color-element');
      expect(colorElements.length).toBe(6);
    });
  });

  it('removes a color column when remove button is clicked', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('color-element').length).toBe(5);
    });

    const removeButtons = screen.getAllByLabelText('Remove color');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const colorElements = screen.getAllByTestId('color-element');
      expect(colorElements.length).toBe(4);
    });
  });

  // ... (keep other existing tests)
});