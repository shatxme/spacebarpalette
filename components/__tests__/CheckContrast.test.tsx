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

  it('displays all color combinations', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const sampleTexts = screen.getAllByText('Sample');
    expect(sampleTexts).toHaveLength(mockColors.length * mockColors.length);
  });

  it('shows contrast ratio for each combination', () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);
    const contrastRatios = screen.getAllByTestId('contrast-ratio');
    expect(contrastRatios).toHaveLength(mockColors.length * mockColors.length);
    expect(contrastRatios[0]).toHaveTextContent('3.00');
    expect(contrastRatios[1]).toHaveTextContent('21.00');
    expect(contrastRatios[2]).toHaveTextContent('4.50');
    expect(contrastRatios[3]).toHaveTextContent('3.00');
    expect(contrastRatios[4]).toHaveTextContent('3.00');
  });

  it('toggles between showing all colors and valid colors only', async () => {
    render(<CheckContrast colors={mockColors} onClose={mockOnClose} />);

    // Initially, all contrasts should be visible
    expect(screen.getAllByText('Sample')).toHaveLength(mockColors.length * mockColors.length);

    // Toggle to show only valid colors
    const toggleSwitch = screen.getByRole('switch');
    await act(async () => {
      await userEvent.click(toggleSwitch);
    });

    await waitFor(() => {
      const visibleSamples = screen.getAllByText('Sample');
      expect(visibleSamples).toHaveLength(4);
      
      // Check specific valid combinations
      const validCombos = [
        { bg: '#FFFFFF', text: '#000000' },
        { bg: '#000000', text: '#FFFFFF' },
        { bg: '#FFFFFF', text: '#FF0000' },
        { bg: '#FF0000', text: '#FFFFFF' }
      ];
      
      validCombos.forEach(combo => {
        const colorSquare = screen.getByText((content, element) => {
          return element?.textContent === `${combo.bg}${combo.text}`;
        });
        expect(colorSquare).toBeInTheDocument();
      });
    });

    // Toggle back to show all colors
    await act(async () => {
      await userEvent.click(toggleSwitch);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Sample')).toHaveLength(mockColors.length * mockColors.length);
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
});