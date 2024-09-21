import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ColorDetailsModal from '../ColorDetailsModal';

describe('ColorDetailsModal', () => {
  const mockColor = '#FF0000';
  const mockOnClose = jest.fn();
  const mockOnColorChange = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the color details', () => {
    render(
      <ColorDetailsModal
        color={mockColor}
        isOpen={true}
        onClose={mockOnClose}
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByDisplayValue(mockColor)).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
    expect(screen.getByText('CMYK')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ColorDetailsModal
        color={mockColor}
        isOpen={true}
        onClose={mockOnClose}
        onColorChange={mockOnColorChange}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onColorChange when color is changed', () => {
    render(
      <ColorDetailsModal
        color={mockColor}
        isOpen={true}
        onClose={mockOnClose}
        onColorChange={mockOnColorChange}
      />
    );

    const colorInput = screen.getByDisplayValue(mockColor);
    fireEvent.change(colorInput, { target: { value: '#00FF00' } });
    expect(mockOnColorChange).toHaveBeenCalledWith('#00FF00');
  });

  it('copies color values when copy button is clicked', async () => {
    render(
      <ColorDetailsModal
        color={mockColor}
        isOpen={true}
        onClose={mockOnClose}
        onColorChange={mockOnColorChange}
      />
    );

    const copyButtons = screen.getAllByRole('button');
    const rgbCopyButton = copyButtons.find(button => button.closest('div')?.textContent?.includes('255, 0, 0'));
    
    expect(rgbCopyButton).toBeTruthy();
    
    if (rgbCopyButton) {
      fireEvent.click(rgbCopyButton);
    
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('255, 0, 0');
      });
    } else {
      throw new Error('RGB copy button not found');
    }
  });
});