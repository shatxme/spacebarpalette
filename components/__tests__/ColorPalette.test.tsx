import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorPalette from '../ColorPalette';

describe('ColorPalette', () => {
  const mockPalette = ['#FF0000', '#00FF00', '#0000FF'];
  const mockLockedColors = [false, true, false];
  const mockOnToggleLock = jest.fn();
  const mockOnColorClick = jest.fn();
  const mockOnReorder = jest.fn();
  const mockOnAddColumn = jest.fn();
  const mockOnRemoveColumn = jest.fn();

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
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
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
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
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
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
      />
    );

    const colorElements = screen.getAllByTestId('color-element');
    fireEvent.click(colorElements[0]);

    expect(mockOnColorClick).toHaveBeenCalledWith(mockPalette[0]);
  });

  it('calls onRemoveColumn when remove button is clicked', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove column/i });
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveColumn).toHaveBeenCalledWith(0);
  });

  it('does not render remove buttons when there is only one color', () => {
    render(
      <ColorPalette
        palette={[mockPalette[0]]}
        lockedColors={[mockLockedColors[0]]}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
      />
    );

    const removeButtons = screen.queryAllByRole('button', { name: /remove column/i });
    expect(removeButtons).toHaveLength(0);
  });

  it('calls onAddColumn when add button is clicked', () => {
    render(
      <ColorPalette
        palette={mockPalette}
        lockedColors={mockLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
      />
    );

    const addButton = screen.getByRole('button', { name: /add column/i });
    fireEvent.click(addButton);

    expect(mockOnAddColumn).toHaveBeenCalled();
  });

  // ... (other existing tests)
});