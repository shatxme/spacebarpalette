import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../page';
import * as colorUtils from '../utils/colorUtils'; // Import colorUtils

// Mock the ColorDetailsModal component
jest.mock('../../components/ColorDetailsModal', () => {
  return function DummyColorDetailsModal({ isOpen }: { isOpen: boolean }) {
    return isOpen ? <div data-testid="color-details-modal">Color Details</div> : null;
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
      expect(screen.getAllByTestId('color-element')).toHaveLength(5);
    });
  });

  it('generates a new palette on spacebar press', async () => {
    render(<Home />);
    fireEvent.keyDown(document, { code: 'Space' });
    await waitFor(() => {
      expect(screen.getAllByTestId('color-element')).toHaveLength(5);
    });
  });

  it('opens color details modal when a color is clicked', async () => {
    render(<Home />);
    await waitFor(() => {
      const colorElements = screen.getAllByTestId('color-element');
      fireEvent.click(colorElements[0]);
    });
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

  it('opens share options and handles share actions', async () => {
    const { exportToPNG, exportToPDF, exportToJSON, sharePalette } = require('../utils/shareUtils');
    render(<Home />);
    
    // Open share dropdown
    await waitFor(() => {
      fireEvent.click(screen.getByText('Share'));
    });

    // Check if share options are displayed
    expect(screen.getByText('Export PNG')).toBeInTheDocument();
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Copy Link')).toBeInTheDocument();

    // Test each share action
    fireEvent.click(screen.getByText('Export PNG'));
    expect(exportToPNG).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Export PDF'));
    expect(exportToPDF).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Export JSON'));
    expect(exportToJSON).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Copy Link'));
    expect(sharePalette).toHaveBeenCalled();
  });

  it('opens and closes adjustment panel', async () => {
    render(<Home />);
  
    // Open adjustment panel
    fireEvent.click(screen.getByText('Adjust'));
    
    // Wait for the adjustment panel to appear
    await waitFor(() => {
      expect(screen.getByText('Adjust Palette')).toBeInTheDocument();
    });

    // Verify that clicking 'Adjust' again doesn't close the panel
    fireEvent.click(screen.getByText('Adjust'));
    expect(screen.getByText('Adjust Palette')).toBeInTheDocument();

    // Close adjustment panel by clicking the close button in the panel header
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Wait for the adjustment panel to disappear
    await waitFor(() => {
      expect(screen.queryByText('Adjust Palette')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('opens adjustment panel without applying changes', async () => {
    const { adjustPaletteHSL } = require('../utils/colorUtils');
    render(<Home />);

    // Reset mock calls
    adjustPaletteHSL.mockClear();

    // Open adjustment panel
    fireEvent.click(screen.getByText('Adjust'));
    
    // Wait for the adjustment panel to appear
    await waitFor(() => {
      expect(screen.getByText('Adjust Palette')).toBeInTheDocument();
    });

    // Make some adjustments
    const hueSlider = screen.getByLabelText('Hue');
    fireEvent.change(hueSlider, { target: { value: '50' } });

    // Verify that the adjustments were not applied immediately
    expect(adjustPaletteHSL).not.toHaveBeenCalled();

    // Close adjustment panel by clicking the close button in the panel header
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Wait for the adjustment panel to disappear
    await waitFor(() => {
      expect(screen.queryByText('Adjust Palette')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify that the adjustments were still not applied
    expect(adjustPaletteHSL).not.toHaveBeenCalled();
  });

  it('renders PaletteControls with correct initial harmony style', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Harmony: Complementary')).toBeInTheDocument();
    });
  });

  it('changes harmony style when a new option is selected', async () => {
    render(<Home />);
    
    // Open harmony style dropdown
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Harmony:/));
    });

    // Select a new harmony style
    fireEvent.click(screen.getByText('Analogous'));

    // Check if the harmony style has been updated
    await waitFor(() => {
      expect(screen.getByText('Harmony: Analogous')).toBeInTheDocument();
    });
  });

  it('generates a new palette with selected harmony style', async () => {
    const generatePalette = jest.spyOn(colorUtils, 'generatePalette').mockImplementation(() => []);

    render(<Home />);

    console.log('Waiting for generatePalette to be called');
    await waitFor(() => {
      expect(generatePalette).toHaveBeenCalled();
    }, { timeout: 5000 });

    console.log('Checking generatePalette arguments');
    // Add any additional checks for the arguments if necessary
  });

  it('renders the header correctly', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Spacebar Palette')).toBeInTheDocument();
  });

  it('handles spacebar press for palette generation on desktop', () => {
    const { container } = render(<Home />);
    fireEvent.keyDown(container, { key: ' ', code: 'Space' });
    // Add assertions to check the result of the interaction
  });

  it('handles circle button click for palette generation on mobile', () => {
    const { getByLabelText } = render(<Home />);
    fireEvent.click(getByLabelText('Generate New Palette'));
    // Add assertions to check the result of the interaction
  });

  it('handles user interactions', async () => {
    const { getByLabelText } = render(<Home />);
    fireEvent.click(getByLabelText('Generate New Palette'));
    // Add assertions to check the result of the interaction
  });
});