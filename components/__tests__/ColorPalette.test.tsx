import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorPalette from '../ColorPalette';

describe('ColorPalette', () => {
  const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
  const mockLockedColors = [false, true, false];
  const mockOnToggleLock = jest.fn();
  const mockOnColorClick = jest.fn();
  const mockOnReorder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all colors in the palette', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
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
        onReorder={mockOnReorder}
      />
    );

    const lockButtons = screen.getAllByRole('button', { name: /lock color|unlock color/i });
    fireEvent.click(lockButtons[0]);

    expect(mockOnToggleLock).toHaveBeenCalledWith(0);
  });

  it('calls onColorClick when a color is clicked', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
      />
    );

    const colorElements = screen.getAllByTestId('color-element');
    fireEvent.click(colorElements[0]);

    expect(mockOnColorClick).toHaveBeenCalledWith(mockPalette[0]);
  });

  it('simulates drag and drop and calls onReorder', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
      />
    );

    const colorElements = screen.getAllByTestId('color-element');

    // Mock dataTransfer object
    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn().mockReturnValue('0'),
    };

    // Simulate drag start
    fireEvent.dragStart(colorElements[0], { dataTransfer });

    // Simulate drop
    fireEvent.drop(colorElements[2], { dataTransfer });

    expect(mockOnReorder).toHaveBeenCalledWith(
      [mockPalette[1], mockPalette[2], mockPalette[0]],
      [mockLockedColors[1], mockLockedColors[2], mockLockedColors[0]]
    );
  });

  it('copies color to clipboard when clicked', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
      />
    );

    const colorTexts = screen.getAllByText(/#[0-9A-F]{6}/i);
    fireEvent.click(colorTexts[0]);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockPalette[0]);
  });
});