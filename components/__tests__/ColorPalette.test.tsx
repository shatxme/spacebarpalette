import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
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
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
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

    const addButton = screen.getByText('Add Color');
    fireEvent.click(addButton);

    expect(mockOnAddColumn).toHaveBeenCalled();
  });

  it('does not render add button when palette has 10 colors', () => {
    const tenColorPalette = Array(10).fill('#000000');
    const tenLockedColors = Array(10).fill(false);

    render(
      <ColorPalette
        palette={tenColorPalette}
        lockedColors={tenLockedColors}
        onToggleLock={mockOnToggleLock}
        onColorClick={mockOnColorClick}
        onReorder={mockOnReorder}
        onAddColumn={mockOnAddColumn}
        onRemoveColumn={mockOnRemoveColumn}
      />
    );

    const addButton = screen.queryByText('Add Color');
    expect(addButton).not.toBeInTheDocument();
  });

  it('renders the correct number of color elements', () => {
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
    expect(colorElements).toHaveLength(mockPalette.length);
  });

  it('copies color to clipboard', async () => {
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

    const colorElement = screen.getByText('#FF0000'); // Use a color from the mockPalette
    await act(async () => {
      fireEvent.click(colorElement);
    });

    // Log the clipboard write call
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#FF0000');
  });
});