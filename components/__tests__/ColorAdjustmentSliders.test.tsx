import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorAdjustmentSliders from '../ColorAdjustmentSliders';

describe('ColorAdjustmentSliders', () => {
  const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };
  const mockOnAdjustmentsChange = jest.fn();

  it('renders all sliders', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    expect(screen.getByLabelText('Hue')).toBeInTheDocument();
    expect(screen.getByLabelText('Saturation')).toBeInTheDocument();
    expect(screen.getByLabelText('Brightness')).toBeInTheDocument();
    expect(screen.getByLabelText('Temperature')).toBeInTheDocument();
  });

  it('calls onAdjustmentsChange when a slider is moved', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    const hueSlider = screen.getByRole('slider', { name: /hue/i });
    fireEvent.change(hueSlider, { target: { value: '50' } });
    expect(mockOnAdjustmentsChange).toHaveBeenCalledWith({ ...mockAdjustments, h: 50 });
  });

  it('resets adjustments when reset button is clicked', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={{ h: 50, s: 50, b: 50, t: 50 }}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(mockOnAdjustmentsChange).toHaveBeenCalledWith({ h: 0, s: 0, b: 0, t: 0 });
  });

  it('updates slider values when adjustments prop changes', () => {
    const { rerender } = render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    const newAdjustments = { h: 50, s: 50, b: 50, t: 50 };
    rerender(
      <ColorAdjustmentSliders
        adjustments={newAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    expect(screen.getByLabelText('Hue')).toHaveValue('50');
    expect(screen.getByLabelText('Saturation')).toHaveValue('50');
    expect(screen.getByLabelText('Brightness')).toHaveValue('50');
    expect(screen.getByLabelText('Temperature')).toHaveValue('50');
  });
});