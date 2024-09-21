import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorPalette from '../ColorPalette';

describe('ColorPalette', () => {
  const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
  const mockLockedColors = [false, true, false];
  const mockOnToggleLock = jest.fn();
  const mockOnColorClick = jest.fn();

  it('renders all colors in the palette', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
      />
    );

    mockPalette.forEach(color => {
      expect(screen.getByText(color.toUpperCase())).toBeInTheDocument();
    });
  });

  it('calls onToggleLock when lock button is clicked', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
      />
    );

    const lockButtons = screen.getAllByRole('button');
    fireEvent.click(lockButtons[0]);

    expect(mockOnToggleLock).toHaveBeenCalledWith(0);
  });
});