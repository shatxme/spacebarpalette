import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaletteControls from '../PaletteControls';
import { HarmonyStyle } from '../../app/utils/colorUtils';

describe('PaletteControls', () => {
  const mockOnHarmonyStyleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct initial harmony style', () => {
    render(
      <PaletteControls
        harmonyStyle="complementary"
        onHarmonyStyleChange={mockOnHarmonyStyleChange}
      />
    );

    expect(screen.getByText('Harmony: Complementary')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', () => {
    render(
      <PaletteControls
        harmonyStyle="complementary"
        onHarmonyStyleChange={mockOnHarmonyStyleChange}
      />
    );

    fireEvent.click(screen.getByText('Harmony: Complementary'));

    expect(screen.getByText('Analogous')).toBeInTheDocument();
    expect(screen.getByText('Triadic')).toBeInTheDocument();
    expect(screen.getByText('Split Complementary')).toBeInTheDocument();
    expect(screen.getByText('Random')).toBeInTheDocument();
  });

  it('calls onHarmonyStyleChange when a new style is selected', () => {
    render(
      <PaletteControls
        harmonyStyle="complementary"
        onHarmonyStyleChange={mockOnHarmonyStyleChange}
      />
    );

    fireEvent.click(screen.getByText('Harmony: Complementary'));
    fireEvent.click(screen.getByText('Analogous'));

    expect(mockOnHarmonyStyleChange).toHaveBeenCalledWith('analogous');
  });

  it('closes the dropdown after selecting a new style', () => {
    render(
      <PaletteControls
        harmonyStyle="complementary"
        onHarmonyStyleChange={mockOnHarmonyStyleChange}
      />
    );

    fireEvent.click(screen.getByText('Harmony: Complementary'));
    fireEvent.click(screen.getByText('Analogous'));

    expect(screen.queryByText('Triadic')).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    render(
      <PaletteControls
        harmonyStyle="complementary"
        onHarmonyStyleChange={mockOnHarmonyStyleChange}
      />
    );

    fireEvent.click(screen.getByText('Harmony: Complementary'));
    expect(screen.getByText('Analogous')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Analogous')).not.toBeInTheDocument();
  });
});