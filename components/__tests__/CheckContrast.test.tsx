import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckContrast from '../CheckContrast';
import { getContrastRatio } from '../../app/utils/colorUtils';

// Mock the getContrastRatio function
jest.mock('../../app/utils/colorUtils', () => ({
  getContrastRatio: jest.fn(),
}));

describe('CheckContrast', () => {
  const mockColors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'];
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getContrastRatio as jest.Mock).mockImplementation((color1, color2) => {
      if ((color1 === '#FFFFFF' && color2 === '#000000') || (color1 === '#000000' && color2 === '#FFFFFF')) return 21;
      if ((color1 === '#FFFFFF' && color2 === '#FF0000') || (color1 === '#FF0000' && color2 === '#FFFFFF')) return 4.5;
      return 3;
    });
  });

  it('renders the modal with correct title', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    expect(screen.getByText('Check Palette Contrast')).toBeInTheDocument();
  });

  it('displays only valid color combinations by default', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const sampleTexts = screen.getAllByText('Sample');
    expect(sampleTexts).toHaveLength(4); // Only valid combinations are shown by default
  });

  it('shows contrast ratio for valid combinations', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const contrastRatios = screen.getAllByTestId('contrast-ratio');
    expect(contrastRatios).toHaveLength(4); // Only valid combinations are shown by default
    
    const ratioValues = contrastRatios.map(ratio => ratio.textContent);
    expect(ratioValues).toContain('21.00');
    expect(ratioValues).toContain('4.50');
    expect(ratioValues.filter(value => value === '21.00')).toHaveLength(2);
    expect(ratioValues.filter(value => value === '4.50')).toHaveLength(2);
  });

  it('toggles between showing valid colors and all colors', async () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);

    // Initially, only valid contrasts should be visible
    expect(screen.getAllByText('Sample')).toHaveLength(4);

    // Toggle to show all colors
    const toggleSwitch = screen.getByRole('switch');
    await act(async () => {
      await userEvent.click(toggleSwitch);
    });

    await waitFor(() => {
      const allSamples = screen.getAllByText('Sample');
      expect(allSamples).toHaveLength(mockColors.length * mockColors.length);
    });

    // Toggle back to show only valid colors
    await act(async () => {
      await userEvent.click(toggleSwitch);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Sample')).toHaveLength(4);
    });
  });

  it('copies background color to clipboard when clicked', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);

    const firstColorSquare = screen.getAllByText('Sample')[0];
    await act(async () => {
      await userEvent.hover(firstColorSquare);
    });
    const bgColorTexts = await screen.findAllByText('#FFFFFF');
    await act(async () => {
      await userEvent.click(bgColorTexts[0]);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('#FFFFFF');
    expect(await screen.findByText('Background color copied!')).toBeInTheDocument();
  });

  it('copies text color to clipboard when clicked', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);

    const firstColorSquare = screen.getAllByText('Sample')[0];
    await act(async () => {
      await userEvent.hover(firstColorSquare);
    });
    const textColorElements = await screen.findAllByText('#000000');
    await act(async () => {
      await userEvent.click(textColorElements[0]);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('#000000');
    expect(await screen.findByText('Text color copied!')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the modal', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    fireEvent.mouseDown(document.body);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking inside the modal', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const modalContent = screen.getByText('Check Palette Contrast').closest('div');
    fireEvent.mouseDown(modalContent!);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles empty color array', () => {
    render(<CheckContrast colors={[]} onClose={mockOnClose} />);
    expect(screen.queryByText('Sample')).not.toBeInTheDocument();
  });

  it('does not show hover effect for placeholder colors', async () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    
    // Toggle to show all colors
    const toggleSwitch = screen.getByRole('switch');
    await act(async () => {
      await userEvent.click(toggleSwitch);
    });

    // Find all color squares
    const colorSquares = screen.getAllByText('Sample');

    // Find the placeholder square (where background and text colors are the same)
    const placeholderSquare = colorSquares.find((square) => {
      const style = window.getComputedStyle(square);
      return style.backgroundColor === style.color;
    });

    expect(placeholderSquare).toBeTruthy();

    if (placeholderSquare) {
      await act(async () => {
        await userEvent.hover(placeholderSquare);
      });

      // Check that the placeholder square doesn't have the hover effect
      const hoverDiv = placeholderSquare.querySelector('.group-hover\\:opacity-100');
      expect(hoverDiv).toBeNull();
    }
  });
});